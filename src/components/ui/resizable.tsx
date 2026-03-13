import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex h-full w-full", className)} {...props}>
    {children}
  </div>
)

const ResizablePanel = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1", className)} {...props}>
    {children}
  </div>
)

const ResizableHandle = ({ className }: { className?: string }) => (
  <div className={cn("w-px bg-border", className)} />
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
