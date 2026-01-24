import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/test-tailwind')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Test Primary Colors */}
        <div>
          <h1 className="text-3xl font-bold text-primary mb-4">Tailwind v4 Test Page</h1>
          <p className="text-muted-foreground">Testing Tailwind v4 with teal/cyan theme (OKLCH)</p>
        </div>

        <Separator />

        {/* Test Card Component */}
        <Card>
          <CardHeader>
            <CardTitle>Card Component Test</CardTitle>
            <CardDescription>This card tests the Shadcn UI card component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Test Input Component */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="test@example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" />
            </div>

            {/* Test Button Variants */}
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>

            {/* Test Button Sizes */}
            <div className="flex flex-wrap items-center gap-2">
              <Button size="default">Default</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette Test</CardTitle>
            <CardDescription>Testing OKLCH color space</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary</Label>
                <div className="h-12 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm">
                  Primary
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary</Label>
                <div className="h-12 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center text-sm">
                  Secondary
                </div>
              </div>
              <div className="space-y-2">
                <Label>Accent</Label>
                <div className="h-12 rounded-md bg-accent text-accent-foreground flex items-center justify-center text-sm">
                  Accent
                </div>
              </div>
              <div className="space-y-2">
                <Label>Muted</Label>
                <div className="h-12 rounded-md bg-muted text-muted-foreground flex items-center justify-center text-sm">
                  Muted
                </div>
              </div>
              <div className="space-y-2">
                <Label>Destructive</Label>
                <div className="h-12 rounded-md bg-destructive text-destructive-foreground flex items-center justify-center text-sm">
                  Destructive
                </div>
              </div>
              <div className="space-y-2">
                <Label>Border</Label>
                <div className="h-12 rounded-md border-2 border-border flex items-center justify-center text-sm">
                  Border
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Radius Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Radius Variants</CardTitle>
            <CardDescription>Testing design tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="text-center">
                <div className="h-12 w-12 bg-primary rounded-sm mb-2"></div>
                <Label className="text-xs">sm</Label>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-primary rounded-md mb-2"></div>
                <Label className="text-xs">md</Label>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-primary rounded-lg mb-2"></div>
                <Label className="text-xs">lg</Label>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 bg-primary rounded-xl mb-2"></div>
                <Label className="text-xs">xl</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            If you can see styled components above, Tailwind v4 is configured correctly!
          </p>
        </div>
      </div>
    </div>
  )
}
