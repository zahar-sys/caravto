import {randomBytes} from 'node:crypto';import {existsSync,writeFileSync} from 'node:fs';
if(existsSync('.env.local')){console.log('.env.local already exists; left unchanged');process.exit(0)}
const password='Rovny-'+randomBytes(12).toString('base64url');writeFileSync('.env.local',`APP_SECRET=${randomBytes(32).toString('hex')}\nOWNER_PASSWORD=${password}\nAPP_URL=http://127.0.0.1:3000\nALLOW_LOCAL_DB=true\n`,{mode:0o600});console.log('Created .env.local. Owner password is in that file (OWNER_PASSWORD). Do not commit it.');
