"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          success: "border-green-700 bg-green-700 text-white",
          error: "border-red-700 bg-red-700 text-white",
          toast: "group [&:has(>div[data-success])]:bg-green-700 [&:has(>div[data-success])]:text-white [&:has(>div[data-success])]:border-green-700 [&:has(>div[data-error])]:bg-red-700 [&:has(>div[data-error])]:text-white [&:has(>div[data-error])]:border-red-700",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }