'use client';
import {useEffect,useState} from 'react';
import type {Item,RequestInput} from '@/lib/domain';
import {randomKey} from './ui';
export type DraftPhoto={id:string;preview:string;name:string;status:'loading'|'done'|'error';error?:string};
export type Draft={items:Item[];form:Omit<RequestInput,'items'|'photos'>;photos:DraftPhoto[];key:string;draftKey:string};
const initial:Draft={items:[],form:{name:'',phone:'',address:'',car:'',consent:false,date:'',time:'',comment:'',outside:false},photos:[],key:'',draftKey:''};
export const DRAFT_KEY='rovny-draft-v1';
export function useDraft(){const [draft,setDraft]=useState<Draft>(initial);const [ready,setReady]=useState(false);const [storageError,setStorageError]=useState('');useEffect(()=>{let d=initial;try{const stored=localStorage.getItem(DRAFT_KEY);if(stored){const parsed=JSON.parse(stored);if(Array.isArray(parsed.items)&&parsed.form)d={...initial,...parsed,photos:(parsed.photos??[]).map((p:DraftPhoto)=>p.status==='loading'?{...p,status:'error',error:'Загрузка прервалась. Повторите.'}:p)}}}catch{}setDraft({...d,key:d.key||randomKey(),draftKey:d.draftKey||randomKey()});setReady(true)},[]);useEffect(()=>{if(ready)try{localStorage.setItem(DRAFT_KEY,JSON.stringify(draft));setStorageError('')}catch{setStorageError('В браузере мало места. Черновик может не сохраниться после закрытия.')}},[draft,ready]);return {draft,setDraft,ready,storageError}}
