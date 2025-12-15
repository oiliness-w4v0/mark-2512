import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { TypographyH4 } from "@/components/ui/h4"

export default function DialogCloseButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>开始事务</Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl!">
        <DialogHeader>
          <DialogTitle>事务列表</DialogTitle>
          <DialogDescription>
            请选择您需要办理的事务类型
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
                  <div className="grid flex-1 gap-2">
                      <TypographyH4>创作部</TypographyH4>
                      <div className="flex flex-wrap gap-1">
                          { 
                              ["请假申请表", "休假申请表", "临时住房申请表"].map((item) => (
                                  <ItemExample key={item} />
                                ))  
                          }
                      </div>
                      <TypographyH4>采购部</TypographyH4>
                      <TypographyH4>技术部</TypographyH4>
                      <TypographyH4>市场管理部</TypographyH4>
            
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ItemExample() {
    return (
        <Item variant="outline" size="sm" asChild>
        <a href="#">
          <ItemMedia>
            <BadgeCheckIcon className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Your profile has been verified.</ItemTitle>
          </ItemContent>
          <ItemActions>
            <ChevronRightIcon className="size-4" />
          </ItemActions>
        </a>
        </Item>
    )
}
