import Home from '@/components/Home';import {settings} from '@/lib/settings';import {defaults} from '@/lib/domain';
export default async function Page(){return <Home settings={await settings().catch(()=>defaults)}/>}
