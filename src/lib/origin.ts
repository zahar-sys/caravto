export function expectedOrigin(requestUrl:string,configured:string|undefined,environment:string|undefined):string {
 if(environment==='production'){
  if(!configured)throw new Error('APP_URL required');
  return new URL(configured).origin;
 }
 return new URL(requestUrl).origin;
}
