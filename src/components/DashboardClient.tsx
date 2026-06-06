'use client'

import { useMemo, useState } from 'react'
import { format, getMonth, getYear } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Transaction, CATEGORY_COLORS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface DashboardClientProps {
  transactions: Transaction[]
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function DashboardClient({ transactions }: DashboardClientProps) {
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(String(getMonth(currentDate)))
  const [selectedYear, setSelectedYear] = useState(String(getYear(currentDate)))

  const years = useMemo(() => {
    const ys = new Set(transactions.map(t => String(getYear(new Date(t.date + 'T00:00:00')))))
    ys.add(String(getYear(currentDate)))
    return Array.from(ys).sort((a, b) => Number(b) - Number(a))
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00')
      return getMonth(d) === Number(selectedMonth) && getYear(d) === Number(selectedYear)
    })
  }, [transactions, selectedMonth, selectedYear])

  const totalReceitas = filtered.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
  const totalDespesas = filtered.filter(t => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)
  const saldo = totalReceitas - totalDespesas

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {}
    filtered.filter(t => t.type === 'despesa').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filtered])

  const recentTransactions = transactions.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Visão geral das suas finanças</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={v => v && setSelectedMonth(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear} onValueChange={v => v && setSelectedYear(v)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map(y => (
                <SelectItem key={y} value={y}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Receitas</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{formatCurrency(totalReceitas)}</p>
              </div>
              <div className="bg-emerald-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Despesas</p>
                <p className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(totalDespesas)}</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`border-0 shadow-sm ${saldo >= 0 ? 'bg-blue-600' : 'bg-orange-500'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Saldo</p>
                <p className="text-2xl font-bold text-white mt-1">{formatCurrency(saldo)}</p>
              </div>
              <div className="bg-white/20 rounded-full p-3">
                <Wallet className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700">Despesas por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            {categoryData.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                Nenhuma despesa no período
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#6b7280'}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-700">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-slate-400 text-sm">
                Nenhuma transação registrada
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map(t => (
                  <div key={t.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-slate-700 truncate max-w-[200px]">{t.description}</span>
                      <span className="text-xs text-slate-400">
                        {t.category} · {format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <span className={`text-sm font-semibold ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
