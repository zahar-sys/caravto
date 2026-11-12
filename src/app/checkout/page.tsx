import Checkout from '@/components/Checkout';import {settings} from '@/lib/settings';import {defaults} from '@/lib/domain';
export const metadata={title:'Оформить заявку',robots:{index:false,follow:false}};
export default async function Page(){return <Checkout settings={await settings().catch(()=>defaults)}/>}
