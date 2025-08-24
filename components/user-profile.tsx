"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, LogOut, Phone, Mail } from "lucide-react"
import { AuthStorage, type User as UserType } from "@/lib/auth"

interface UserProfileProps {
  user: UserType
  onLogout: () => void
}

export function UserProfile({ user, onLogout }: UserProfileProps) {
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    AuthStorage.logout()
    onLogout()
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        className="w-10 h-10 rounded-full p-0 border-2 border-green-500 bg-transparent"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <User className="w-4 h-4 text-green-600" />
      </Button>

      {showDropdown && (
        <Card className="absolute right-0 top-12 w-64 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="text-center border-b pb-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">{user.name}</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground flex-shrink-0">Email:</span>
                  <span className="font-medium break-all text-xs leading-tight">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground flex-shrink-0">Phone:</span>
                  <span className="font-medium">{user.phone}</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full flex items-center gap-2 text-destructive hover:text-destructive bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
