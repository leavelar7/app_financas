import Link from 'next/link'
import {
  TrendingUp, TrendingDown, Wallet, PieChart, ListFilter,
  FileDown, ShieldCheck, Smartphone, ArrowRight, CircleDollarSign,
  BadgeCheck, ChartPie
} from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

const features = [
  {
    icon: PieChart,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950',
    title: 'Dashboard Visual',
    description: 'Veja um resumo completo das suas finanças com gráficos de pizza por categoria e cards de receita, despesa e saldo.',
  },
  {
    icon: CircleDollarSign,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    title: 'Controle de Transações',
    description: 'Registre receitas e despesas com descrição, valor, data e categoria. Edite ou exclua com um clique.',
  },
  {
    icon: ListFilter,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-950',
    title: 'Filtros Avançados',
    description: 'Filtre por mês, ano, categoria ou tipo. Busque qualquer transação pela descrição instantaneamente.',
  },
  {
    icon: FileDown,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-950',
    title: 'Exportar CSV',
    description: 'Exporte suas transações filtradas em formato .csv para análise em Excel ou Google Sheets.',
  },
  {
    icon: ShieldCheck,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950',
    title: 'Dados Seguros',
    description: 'Autenticação segura via Supabase Auth. Cada usuário acessa somente seus próprios dados com Row Level Security.',
  },
  {
    icon: Smartphone,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    title: 'Responsivo',
    description: 'Interface adaptável para desktop, tablet e celular. Use de onde você estiver.',
  },
]

const stats = [
  { label: 'Categorias', value: '9', icon: ChartPie, color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Receitas', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', value: '+' },
  { label: 'Despesas', icon: TrendingDown, color: 'text-red-500', value: '-' },
  { label: 'Saldo', icon: Wallet, color: 'text-violet-600 dark:text-violet-400', value: '=' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-xl p-2">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800 dark:text-white">FinançasPro</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 -z-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-950 rounded-full blur-3xl opacity-40 -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-violet-100 dark:bg-violet-950 rounded-full blur-3xl opacity-40 -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <BadgeCheck className="w-4 h-4" />
            Controle financeiro simples e visual
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
            Suas finanças,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
              organizadas
            </span>{' '}
            de verdade
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Registre receitas e despesas, visualize seu saldo em tempo real,
            filtre por categorias e exporte relatórios — tudo em um lugar só.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-base shadow-lg shadow-blue-500/20"
            >
              Começar agora — é grátis
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors text-base"
            >
              Já tenho conta
            </Link>
          </div>
        </div>

        {/* Mock dashboard preview */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-hidden">
            {/* Mock header */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 mx-4 h-5 bg-slate-100 dark:bg-slate-800 rounded-md" />
            </div>
            {/* Mock cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-emerald-50 dark:bg-emerald-950 rounded-xl p-4">
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">Receitas</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">R$ 5.400</p>
                <div className="mt-2 h-1.5 bg-emerald-200 dark:bg-emerald-800 rounded-full">
                  <div className="h-1.5 bg-emerald-500 rounded-full w-3/4" />
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-950 rounded-xl p-4">
                <p className="text-xs text-red-500 font-medium mb-1">Despesas</p>
                <p className="text-lg font-bold text-red-600 dark:text-red-400">R$ 2.130</p>
                <div className="mt-2 h-1.5 bg-red-200 dark:bg-red-800 rounded-full">
                  <div className="h-1.5 bg-red-500 rounded-full w-2/5" />
                </div>
              </div>
              <div className="bg-blue-600 rounded-xl p-4">
                <p className="text-xs text-blue-200 font-medium mb-1">Saldo</p>
                <p className="text-lg font-bold text-white">R$ 3.270</p>
                <div className="mt-2 h-1.5 bg-blue-500 rounded-full">
                  <div className="h-1.5 bg-white/60 rounded-full w-3/5" />
                </div>
              </div>
            </div>
            {/* Mock transaction rows */}
            <div className="space-y-2">
              {[
                { label: 'Salário', cat: 'Salário', val: '+ R$ 5.000', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
                { label: 'Supermercado', cat: 'Alimentação', val: '- R$ 380', color: 'text-red-500', dot: 'bg-orange-500' },
                { label: 'Conta de luz', cat: 'Moradia', val: '- R$ 220', color: 'text-red-500', dot: 'bg-violet-500' },
                { label: 'Freelance web', cat: 'Freelance', val: '+ R$ 400', color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-yellow-500' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${row.dot}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{row.label}</p>
                      <p className="text-xs text-slate-400">{row.cat}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-semibold ${row.color}`}>{row.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Tudo que você precisa para organizar suas finanças
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              Funcionalidades pensadas para quem quer praticidade e clareza no controle do dinheiro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, color, bg, title, description }) => (
              <div
                key={title}
                className="group p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${bg} mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-white text-base mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-violet-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para assumir o controle?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Crie sua conta gratuitamente e comece a registrar suas finanças hoje mesmo.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-base shadow-xl"
          >
            Criar conta grátis
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">FinançasPro</span>
          </div>
          <p className="text-sm text-slate-400 dark:text-slate-500">
            Gestão financeira pessoal simples e visual
          </p>
          <ThemeToggle />
        </div>
      </footer>
    </div>
  )
}
