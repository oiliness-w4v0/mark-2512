import { useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const familyMemberSchema = z.object({
  name: z.string().min(1, "姓名不能为空"),
  relation: z.string().min(1, "关系不能为空"),
  phone: z.string().optional(),
})

const formSchema = z.object({
  name: z.string().min(2, "姓名至少2个字符"),
  gender: z.string({ required_error: "请选择性别" }),
  idCard: z.string().regex(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, "身份证格式不正确").optional().or(z.literal("")),
  phone: z.string().min(11, "手机号格式不正确").optional().or(z.literal("")),
  email: z.string().email("邮箱格式不正确").optional().or(z.literal("")),
  address: z.string().optional(),
  familyMembers: z.array(familyMemberSchema).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function UserInfo() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "李逍遥",
      gender: "male",
      idCard: "510***********001X",
      phone: "",
      email: "",
      address: "",
      familyMembers: [
        { name: "李大娘", relation: "婶婶", phone: "13800000000" }
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "familyMembers",
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(data)
    alert("保存成功！\n" + JSON.stringify(data, null, 2))
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
            <CardDescription>请完善您的个人基本资料</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">姓名</Label>
                <Input id="name" {...form.register("name")} />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">性别</Label>
                <Controller
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">男</SelectItem>
                        <SelectItem value="female">女</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.gender && (
                  <p className="text-sm text-red-500">{form.formState.errors.gender.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="idCard">身份证号</Label>
                <Input id="idCard" {...form.register("idCard")} />
                {form.formState.errors.idCard && (
                  <p className="text-sm text-red-500">{form.formState.errors.idCard.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">手机号码</Label>
                <Input id="phone" {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">电子邮箱</Label>
                <Input id="email" type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">联系地址</Label>
                <Textarea id="address" {...form.register("address")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>家庭成员</CardTitle>
              <CardDescription>添加您的主要家庭成员信息</CardDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", relation: "" })}
            >
              <Plus className="w-4 h-4 mr-2" />
              添加成员
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-md bg-slate-50 dark:bg-slate-900/50">
                <div className="space-y-2 flex-1">
                  <Label>姓名</Label>
                  <Input {...form.register(`familyMembers.${index}.name` as const)} placeholder="成员姓名" />
                  {form.formState.errors.familyMembers?.[index]?.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.familyMembers[index]?.name?.message}</p>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Label>关系</Label>
                  <Input {...form.register(`familyMembers.${index}.relation` as const)} placeholder="与本人关系" />
                  {form.formState.errors.familyMembers?.[index]?.relation && (
                    <p className="text-sm text-red-500">{form.formState.errors.familyMembers[index]?.relation?.message}</p>
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <Label>联系电话</Label>
                  <Input {...form.register(`familyMembers.${index}.phone` as const)} placeholder="联系电话" />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                暂无家庭成员信息
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>重置</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "保存中..." : "保存信息"}
          </Button>
        </div>
      </form>
    </div>
  )
}