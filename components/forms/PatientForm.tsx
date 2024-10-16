"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Divide } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patients.action"
import CustomFormField from "../ui/CustomFormField"


export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton',
}


const PatientForm = () => {
  // 1. Define your form.
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",  
      email: "",
      phone: "",
    },
  })

  // 2. Define a submit handler.
   const onSubmit = async(values: z.infer<typeof UserFormValidation>) => {
    
    setIsLoading(true);

    try {
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone
      };
      // const userData = { name, email, phone};
      const user = await createUser(userData);
      console.log(user)

      if(user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
      console.log(error);      
    }
    setIsLoading(false);
  }


return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header">Hi there 👋 </h1>
            <p className="text-dark-700">Schedule Your First Appointment</p>
        </section>
        <CustomFormField 
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name="name"
        label = "full name"
        placeholder = "JohnDoe"
        iconSrc = "/assets/icons/user.svg"
        iconAlt="user"
        />

        <CustomFormField 
        fieldType = {FormFieldType.INPUT}
        control = {form.control}
        name="email"
        label = "Email"
        placeholder = "JohnDoe@example.com"
        iconSrc = "/assets/icons/email.svg"
        iconAlt="email"
        />

        <CustomFormField 
        fieldType = {FormFieldType.PHONE_INPUT}
        control = {form.control}
        name="phone"
        label = "Phone Number"
        placeholder = "012456789"
        />
      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
)

}


export default PatientForm