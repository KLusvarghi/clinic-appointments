"use-client";

import {
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  Clock,
  Mail,
  Menu,
  Phone,
  Shield,
  Smartphone,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocale } from "@/providers/locale-provider";

export default function Home() {
  const { t } = useLocale();
  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <Calendar className="text-primary h-8 w-8" />
            <span className="text-2xl font-bold">Doutor Agenda</span>
          </div>
          <nav className="hidden items-center space-x-6 md:flex">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("nav.features")}
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("nav.pricing")}
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground hover:text-foreground"
            >
              {t("nav.contact")}
            </Link>
            <Button variant="outline">{t("nav.signIn")}</Button>
            <Button>{t("nav.startFree")}</Button>
          </nav>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            {t("hero.newIntegration")}
          </Badge>
          <h1 className="from-primary to-primary/60 mb-6 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            {t("hero.heading")}
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            {t("hero.description")}
          </p>
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8 text-lg">
              {t("hero.startFree")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-lg">
              {t("hero.demo")}
            </Button>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="text-primary mb-2 text-3xl font-bold">50k+</div>
              <div className="text-muted-foreground">{t("hero.metrics1")}</div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-3xl font-bold">2k+</div>
              <div className="text-muted-foreground">{t("hero.metrics2")}</div>
            </div>
            <div className="text-center">
              <div className="text-primary mb-2 text-3xl font-bold">99.9%</div>
              <div className="text-muted-foreground">{t("hero.metrics3")}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Tudo que você precisa para gerenciar seu negócio
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
              Recursos completos para automatizar seus agendamentos e aumentar
              sua produtividade
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Calendar className="text-primary mb-4 h-12 w-12" />
                <CardTitle>Agendamento Online</CardTitle>
                <CardDescription>
                  Permita que seus clientes agendem 24/7 através do seu site
                  personalizado
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Smartphone className="text-primary mb-4 h-12 w-12" />
                <CardTitle>App Mobile</CardTitle>
                <CardDescription>
                  Gerencie seus agendamentos em qualquer lugar com nosso app
                  nativo
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Clock className="text-primary mb-4 h-12 w-12" />
                <CardTitle>Lembretes Automáticos</CardTitle>
                <CardDescription>
                  Reduza faltas com lembretes por SMS, WhatsApp e email
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Users className="text-primary mb-4 h-12 w-12" />
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>
                  Mantenha histórico completo e personalize o atendimento
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <BarChart3 className="text-primary mb-4 h-12 w-12" />
                <CardTitle>Relatórios Inteligentes</CardTitle>
                <CardDescription>
                  Analise seu desempenho com dashboards e métricas detalhadas
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <Shield className="text-primary mb-4 h-12 w-12" />
                <CardTitle>Segurança Total</CardTitle>
                <CardDescription>
                  Seus dados protegidos com criptografia e backup automático
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              O que nossos clientes dizem
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;Revolucionou minha clínica! Agora tenho 40% menos faltas
                  e meus clientes adoram a praticidade.&quot;
                </p>
                <div className="font-semibold">Dr. Maria Silva</div>
                <div className="text-muted-foreground text-sm">
                  Clínica Estética
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;Economizo 3 horas por dia que gastava organizando
                  agenda. Agora foco apenas nos atendimentos.&quot;
                </p>
                <div className="font-semibold">Carlos Mendes</div>
                <div className="text-muted-foreground text-sm">
                  Barbearia Premium
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  &quot;Interface intuitiva e suporte excepcional. Recomendo
                  para qualquer profissional autônomo.&quot;
                </p>
                <div className="font-semibold">Ana Costa</div>
                <div className="text-muted-foreground text-sm">
                  Personal Trainer
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-muted/30 px-4 py-20">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Planos que crescem com seu negócio
            </h2>
            <p className="text-muted-foreground text-xl">
              Comece grátis e escale conforme sua necessidade
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Starter</CardTitle>
                <div className="mt-4 text-4xl font-bold">Grátis</div>
                <CardDescription>Para começar</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Até 50 agendamentos/mês
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />1
                    profissional
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Lembretes básicos
                  </li>
                </ul>
                <Button className="mt-6 w-full" variant="outline">
                  Começar Grátis
                </Button>
              </CardContent>
            </Card>
            <Card className="border-primary relative border-2 shadow-lg">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                Mais Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Professional</CardTitle>
                <div className="mt-4 text-4xl font-bold">
                  R$ 29<span className="text-lg">/mês</span>
                </div>
                <CardDescription>Para profissionais</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Agendamentos ilimitados
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Até 3 profissionais
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    WhatsApp + SMS
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Relatórios avançados
                  </li>
                </ul>
                <Button className="mt-6 w-full">Começar Teste Grátis</Button>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="mt-4 text-4xl font-bold">
                  R$ 79<span className="text-lg">/mês</span>
                </div>
                <CardDescription>Para empresas</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Tudo do Professional
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Profissionais ilimitados
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    API personalizada
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-3 h-5 w-5 text-green-500" />
                    Suporte prioritário
                  </li>
                </ul>
                <Button className="mt-6 w-full" variant="outline">
                  Falar com Vendas
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-xl">
            Junte-se a milhares de profissionais que já automatizaram seus
            agendamentos
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8 text-lg">
              Começar Gratuitamente
            </Button>
            <Button size="lg" variant="outline" className="px-8 text-lg">
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted/50 px-4 py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <Calendar className="text-primary h-8 w-8" />
                <span className="text-2xl font-bold">Agendin</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Simplifique seus agendamentos com inteligência artificial
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span>(13) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4" />
                  <span>contato@doutoragenda.com.br</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Produto</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Recursos
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Preços
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Integrações
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Empresa</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Sobre
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold">Suporte</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Documentação
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Status
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Comunidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="text-muted-foreground flex flex-col items-center justify-between text-sm md:flex-row">
            <div>© 2025 Doutor Agenda. Todos os direitos reservados.</div>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <Link href="#" className="hover:text-foreground">
                Privacidade
              </Link>
              <Link href="#" className="hover:text-foreground">
                Termos
              </Link>
              <Link href="#" className="hover:text-foreground">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
