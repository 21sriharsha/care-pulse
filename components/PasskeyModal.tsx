'use client'
import React, { useEffect, useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { decryptKey, encryptKey } from '@/lib/utils';


const PasskeyModal = () => {
    const router = useRouter();
    const [open, setopen] = useState(true);
    const [passkey, setpasskey] = useState('');
    const [error, seterror] = useState('');
    const path = usePathname();

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey'): null;

    useEffect(() => {
        const accessKey = encryptedKey && decryptKey(encryptedKey);

      if(path) {
        if(accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);
            setopen(false);
            router.push('/admin');
        }
        else{
            setopen(true);
        }
      }
    }, [encryptedKey])
    


    const closeModal = () => {
        setopen(false);
        router.push('/')
    }

    const validatePasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        e.preventDefault();

        if(passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
            const encryptedKey = encryptKey(passkey);

            localStorage.setItem('accessKey', encryptedKey);
            setopen(false);
        }
        else{
            seterror('Invalid PassKey, Try Again')
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setopen}>
            <AlertDialogContent className='shad-alert-dialog'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex items-start justify-between'>
                        Admin Access Verification
                        <Image
                            src="/assets/icons/close.svg"
                            alt='close'
                            height={20}
                            width={20}
                            onClick={() => closeModal()}
                            className='cursor-pointer'
                        />
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        To Access the Admin Page, Please Enter the PassKey
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <InputOTP maxLength={6} value={passkey} onChange={(value) => setpasskey(value)}>
                    <InputOTPGroup className='shad-otp'>
                        <InputOTPSlot  className='shad-otp-slot' index={0} />
                        <InputOTPSlot  className='shad-otp-slot' index={1} />
                        <InputOTPSlot  className='shad-otp-slot' index={2} />
                        <InputOTPSlot  className='shad-otp-slot' index={3} />
                        <InputOTPSlot  className='shad-otp-slot' index={4} />
                        <InputOTPSlot  className='shad-otp-slot' index={5} />
                    </InputOTPGroup>
                </InputOTP>

                {error && <p className='shad-error text-14-regular mt-4 flex-justify-center'>{ error }</p>}

                <AlertDialogFooter>
                    <AlertDialogAction 
                    onClick={(e) => validatePasskey(e)}
                    className="shad-primary-btn w-full"
                    >Enter Admin PassKey</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}

export default PasskeyModal