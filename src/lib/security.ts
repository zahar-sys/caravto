import { expectedOrigin } from './origin';
import { randomBytes,scryptSync,timingSafeEqual,createHash,createHmac } from 'node:crypto';
import { get,put,remove,rateHit } from './store';
export class HttpError extends Error{constructor(public status:number,message:string,public fields?:Record<string,string>){super(message)}}
export const token=()=>randomBytes(32).toString('hex');
export const digest=(s:string)=>createHash('sha256').update(s).digest('hex');
export function secret(){const s=process.env.APP_SECRET;if(!s||s.length<32)throw new Error('Run npm run setup or configure APP_SECRET');return s}
export const orderId=(key:string)=>createHmac('sha256',secret()).update('order:'+key).digest('hex');
export function hashPassword(p:string){const salt=randomBytes(16).toString('hex');return salt+':'+scryptSync(p,salt,64).toString('hex')}
export function checkPassword(p:string,h:string){const [salt,hash]=h.split(':');try{return timingSafeEqual(scryptSync(p,salt,64),Buffer.from(hash,'hex'))}catch{return false}}
export type Auth={hash:string;version:string};
export async function authConfig():Promise<Auth>{let a=await get<Auth>('auth');if(!a){const p=process.env.OWNER_PASSWORD;if(!p||p.length<12)throw new Error('OWNER_PASSWORD must have at least 12 characters');await put('auth','config',{hash:hashPassword(p),version:token()},true);a=await get<Auth>('auth')}return a!}
export async function owner(req:Request){const raw=req.headers.get('cookie')?.match(/(?:^|;\s*)owner_session=([a-f0-9]{64})(?:;|$)/)?.[1];if(!raw)throw new HttpError(401,'Войдите в кабинет');const session=await get<{expires:number;version:string}>(`session:${digest(raw)}`);const a=await authConfig();if(!session||session.expires<Date.now()||session.version!==a.version)throw new HttpError(401,'Сессия завершена. Войдите снова');return raw}
export const cookie=(value:string,max=604800)=>`owner_session=${value}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${max}${process.env.NODE_ENV==='production'&&process.env.APP_URL?.startsWith('https:')?'; Secure':''}`;
export async function protect(req:Request,limit=60){const url=new URL(req.url);const configured=process.env.APP_URL;if(process.env.NODE_ENV==='production'&&!configured)throw new Error('APP_URL required');const expected=expectedOrigin(req.url,configured,process.env.NODE_ENV);const origin=req.headers.get('origin');if(!['GET','HEAD'].includes(req.method)&&origin!==expected)throw new HttpError(403,'Запрос с другого сайта отклонён');const ip=process.env.TRUST_PROXY==='true'?req.headers.get('x-forwarded-for')?.split(',')[0].trim()||'unknown':'local';if(!await rateHit(digest(ip+url.pathname),limit,60000))throw new HttpError(429,'Слишком много запросов. Подождите минуту')}
export async function bytes(req:Request,max:number){if(Number(req.headers.get('content-length'))>max)throw new HttpError(413,'Файл слишком большой');const reader=req.body?.getReader();if(!reader)throw new HttpError(400,'Пустой запрос');const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new HttpError(413,'Превышен размер запроса')}chunks.push(value)}return Buffer.concat(chunks)}
export async function json(req:Request){try{return JSON.parse((await bytes(req,100000)).toString())}catch(e){if(e instanceof HttpError)throw e;throw new HttpError(400,'Не удалось прочитать данные')}}
export async function logout(req:Request){const raw=await owner(req);await remove(`session:${digest(raw)}`)}
