"use client";

import { UploadIcon } from "lucide-react";
import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface User {
  id: string
  name: string
  email: string
  role: "ADMIN" | "MANAGER" | "EMPLOYEE" | "COLLABORATOR"
  avatar?: string
  createdAt: string
  status: "ACTIVE" | "INACTIVE"
}

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  user?: User | null
  onSave: (user: Omit<User, "id" | "createdAt">) => void
}

export function UpsertUserForm({ open, onOpenChange, mode, user, onSave }: UserDialogProps) {
  const [formData, setFormData] = React.useState({
      name: "",
      email: "",
      role: "EMPLOYEE" as User["role"],
      avatar: "",
      status: "ACTIVE" as User["status"],
    })
  
    React.useEffect(() => {
      if (mode === "edit" && user) {
        setFormData({
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar || "",
          status: user.status,
        })
      } else {
        setFormData({
          name: "",
          email: "",
          role: "EMPLOYEE",
          avatar: "",
          status: "ACTIVE",
        })
      }
    }, [mode, user, open])
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSave(formData)
    }
  
    const handleInputChange = (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Adicionar Usuário" : "Editar Usuário"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Adicione um novo colaborador à sua clínica"
              : "Faça alterações nas informações do usuário"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={formData.avatar || "/placeholder.svg"}
                  alt={formData.name}
                />
                <AvatarFallback>
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm">
                <UploadIcon className="mr-2 h-4 w-4" />
                Alterar foto
              </Button>
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Digite o email"
                required
              />
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label htmlFor="role">Função</Label>
              <Select
                value={formData.role}
                onValueChange={(value: User["role"]) =>
                  handleInputChange("role", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma função" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">
                    <div className="flex flex-col items-start">
                      <span>Admin</span>
                      <span className="text-muted-foreground text-xs">
                        Acesso total ao sistema
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MANAGER">
                    <div className="flex flex-col items-start">
                      <span>Gerente</span>
                      <span className="text-muted-foreground text-xs">
                        Gerencia equipes e processos
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="EMPLOYEE">
                    <div className="flex flex-col items-start">
                      <span>Funcionário</span>
                      <span className="text-muted-foreground text-xs">
                        Acesso limitado às funções
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="COLLABORATOR">
                    <div className="flex flex-col items-start">
                      <span>Colaborador</span>
                      <span className="text-muted-foreground text-xs">
                        Acesso específico por projeto
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: User["status"]) =>
                  handleInputChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Ativo</SelectItem>
                  <SelectItem value="INACTIVE">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "create" ? "Criar usuário" : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


