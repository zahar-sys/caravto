import OrderStatus from '@/components/OrderStatus';
export const metadata={title:'Ваша заявка',robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <OrderStatus id={id}/>}
