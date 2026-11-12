import type {Metadata,Viewport} from 'next';
import './globals.css';
import {settings} from '@/lib/settings';
import {defaults} from '@/lib/domain';
import RegisterSW from '@/components/RegisterSW';
export const metadata:Metadata={title:{default:'Ровный ход — автосервис с понятным подходом',template:'%s · Ровный ход'},description:'Выберите работы для автомобиля, узнайте предварительную стоимость и отправьте заявку. Цену и время визита подтвердит мастер.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,statusBarStyle:'default',title:'Ровный ход'},robots:{index:true,follow:true},icons:{icon:'/icons/icon.svg',apple:'/icons/apple-touch-icon.png'}};
export const viewport:Viewport={width:'device-width',initialScale:1,themeColor:[{media:'(prefers-color-scheme: light)',color:'#f5f6f8'},{media:'(prefers-color-scheme: dark)',color:'#14171e'}]};
export const dynamic='force-dynamic';
export default async function RootLayout({children}:{children:React.ReactNode}){const s=await settings().catch(()=>defaults);return <html lang="ru" suppressHydrationWarning style={{'--accent':s.company.accent} as React.CSSProperties}><head><script dangerouslySetInnerHTML={{__html:`try{document.documentElement.dataset.theme=localStorage.getItem('rovny-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light')}catch{}`}}/></head><body><a className="skip-link" href="#main-content">Перейти к содержимому</a><div id="main-content">{children}</div><RegisterSW/></body></html>}
