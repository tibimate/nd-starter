import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuShortcut, DropdownMenu } from "@/components/ui/dropdown-menu";
import { EllipsisIcon, Loader2, LockIcon, PencilIcon, Trash2Icon, UploadIcon, UserCheck2Icon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { userService } from "@/hooks/userService";
import { Profile } from "@/types/models";
import { toast } from "sonner";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Image from "next/image"
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function AccountSidebar() {
  const {data: session,  update: updateSession} = useSession()
  const currentPage = usePathname()

  const avatarChanged = (profile: Profile) => {
    handleUpdateSession(profile)
  }

  const handleUpdateSession = async (profileData: Profile) => {
    await updateSession({
      profile: profileData
    });
    toast.success("Session updated with new profile data!", {
      position: "top-center",
      unstyled: true,
      classNames: {
        toast: "bg-green-100 flex items-center gap-4 text-sm text-green-500 rounded-md px-4 py-3 shadow",
      },
    });
  };

  return (
    <div className="w-full md:w-64">
      {/* Sidebar */}
      <div className="md:hidden block flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" ><EllipsisIcon /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>              
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="w-full md:block hidden py-0">
        <CardHeader className="p-0 relative">
          <Avatar onSuccess={avatarChanged} src={session?.user?.profile.avatar_thumbnails?.small || ""} alt={session?.user?.profile.user.username || "User Avatar"} />
        </CardHeader>
        <CardHeader className="px-2 pt-2">
          <CardTitle>{session?.user?.profile.user.first_name} {session?.user?.profile.user.last_name}</CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-col">
            <Link className={cn(buttonVariants({variant: "ghost"}), "justify-start", currentPage === "/account" ? "bg-gray-100 dark:bg-gray-700" : "")}  href={"/account"}>
              <UserIcon className="size-4" />
              Account
            </Link>
            <Link className={cn(buttonVariants({variant: "ghost"}), "justify-start", currentPage === "/account/profile" ? "bg-gray-100 dark:bg-gray-700" : "")} href={"/account/profile"}>
              <UserCheck2Icon className="size-4" />
              Profile
            </Link>
            <Link className={cn(buttonVariants({variant: "ghost"}), "justify-start", currentPage === "/account/password" ? "bg-gray-100 dark:bg-gray-700" : "")} href={"/account/password"}>
              <LockIcon className="size-4" />
              Password
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          
        </CardFooter>
      </Card>
    </div>
  )
}

function Avatar({ src, alt, onSuccess }: { src: string, alt: string, onSuccess: (profile: Profile) => void }) {

  const inputRef = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState(src || "https://avatars.githubusercontent.com/u/1?v=4");
  const [loading, setLoading] = useState(false);
  const handleSelectFile = () => {
    inputRef?.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setImgSrc(URL.createObjectURL(file));
      userService.updateAccount({ avatar: file }).then((response) => {
          onSuccess(response);
      }).catch((error) => {
          console.error("Error updating account:", error.response || error);
          toast.error("Failed to update avatar. Please try again.", {
            position: "top-center",
            unstyled: true,
            classNames: {
              toast: "bg-red-100 flex items-center gap-4 text-sm text-red-500 rounded-md px-4 py-3 shadow",
            },
          });
          setImgSrc(src); // Revert to original image on error
      }).finally(() => {
        setLoading(false);
      })
       
    }
  };

  return (
    <div className="w-full relative group">
      <AspectRatio ratio={16 / 9}>
        <Image
          src={imgSrc} 
          alt={alt} 
          fill
          className="rounded-t-lg object-cover dark:brightness-20"
          unoptimized
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-t-lg z-20">
            <Loader2 className="size-8 text-white animate-spin" />
          </div>
        )}
        <div className="absolute z-10 bottom-2 right-2  items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="xs" className="rounded-full bg-black/20 border-0 hover:bg-black/30 text-zinc-300 hover:text-zinc-100"><EllipsisIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleSelectFile}>
                  {src ? 
                    <>
                    <PencilIcon className="size-4" /> 
                    Change avatar
                    </>
                  : 
                  <>
                    <UploadIcon className="size-4" />
                    Upload avatar
                    </>
                    }
                  
                </DropdownMenuItem>
                {src && (
                  <DialogRemoveAvatar onSuccess={(profile) => onSuccess(profile)} />
                )}
              </DropdownMenuGroup>
              
              
            </DropdownMenuContent>
          </DropdownMenu>
          <input ref={inputRef} type="file" className="hidden" name="file" onChange={handleFileChange} />
        </div>
        <div className="absolute w-full z-0 h-full">
          <div className="w-full h-full rounded-t-lg bg-gradient-to-t from-transparent to-black/30" />
        </div>

      </AspectRatio>
    </div>
  )
}

function DialogRemoveAvatar({onSuccess}: {onSuccess: (profile: Profile) => void}) {

  const handleRemove = () => {
    userService.removeAvatar().then((response) => {
      console.log("remove avatar response", response)
      toast.success("Avatar removed successfully!", {
        position: "top-center",
        unstyled: true,
        classNames: {
          toast: "bg-green-100 flex items-center gap-4 text-sm text-green-500 rounded-md px-4 py-3 shadow",
        },
      });
      onSuccess(response)
    }
    ).catch((error) => {
      console.log("error", error.response || error)
      toast.error("Failed to remove avatar. Please try again.", {
        position: "top-center",
        unstyled: true,
        classNames: {
          toast: "bg-red-100 flex items-center gap-4 text-sm text-red-500 rounded-md px-4 py-3 shadow",
        },
      });
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Trash2Icon className="size-4" />
          Remove avatar
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="size-10 bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon className="size-4" />
          </AlertDialogMedia>
          <AlertDialogTitle>Remove avatar?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove your avatar and cannot be undone. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline" size="sm">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" size="sm" onClick={(e) => {handleRemove()}}>Remove</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}