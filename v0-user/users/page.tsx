"use client"

import * as React from "react"
import { PlusIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserDialog } from "@/components/user-dialog"

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "COLLABORATOR"
  avatar?: string
  createdAt: string
  status: "ACTIVE" | "INACTIVE"
}

// Mock data - replace with your actual data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Dr. João Silva",
    email: "joao.silva@clinica.com",
    role: "ADMIN",
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: "2024-01-15",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@clinica.com",
    role: "MANAGER",
    avatar: "/placeholder.svg?height=32&width=32",
    createdAt: "2024-02-10",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@clinica.com",
    role: "EMPLOYEE",
    createdAt: "2024-03-05",
    status: "ACTIVE",
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana.oliveira@clinica.com",
    role: "COLLABORATOR",
    createdAt: "2024-03-20",
    status: "INACTIVE",
  },
]

const getRoleBadgeVariant = (role: User["role"]) => {
  switch (role) {
    case "ADMIN":
      return "default"
    case "MANAGER":
      return "secondary"
    case "EMPLOYEE":
      return "outline"
    case "COLLABORATOR":
      return "outline"
    default:
      return "outline"
  }
}

const getRoleColor = (role: User["role"]) => {
  switch (role) {
    case "ADMIN":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "MANAGER":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "EMPLOYEE":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "COLLABORATOR":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    default:
      return ""
  }
}

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [dialogMode, setDialogMode] = React.useState<"create" | "edit">("create")

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateUser = () => {
    setSelectedUser(null)
    setDialogMode("create")
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setDialogMode("edit")
    setIsDialogOpen(true)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const handleSaveUser = (userData: Omit<User, "id" | "createdAt">) => {
    if (dialogMode === "create") {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      }
      setUsers((prev) => [...prev, newUser])
    } else if (selectedUser) {
      setUsers((prev) => prev.map((user) => (user.id === selectedUser.id ? { ...user, ...userData } : user)))
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground">Gerencie os usuários da sua clínica</p>
        </div>
        <Button onClick={handleCreateUser}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Adicionar Usuário
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <UserIcon className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {searchTerm ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)} className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "ACTIVE" ? "default" : "secondary"}
                      className={
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }
                    >
                      {user.status === "ACTIVE" ? "Ativo" : "Inativo"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          <PencilIcon className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-destructive">
                          <TrashIcon className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        mode={dialogMode}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  )
}
