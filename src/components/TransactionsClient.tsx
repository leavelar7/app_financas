'use client'

import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format, getMonth, getYear } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { Transaction, CATEGORIES, CATEGORY_COLORS } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import TransactionForm from '@/components/TransactionForm'
import { Plus, Search, Download, Pencil, Trash2 } from 'lucide-react'

interface TransactionsClientProps {
  initialTransactions: Transaction[]
}

const MONTHS = [
  'Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function TransactionsClient({ initialTransactions }: TransactionsClientProps) {
  const router = useRouter()
  const [transactions, setTransactions] = useState(initialTransactions)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const currentDate = new Date()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMonth, setFilterMonth] = useState(String(getMonth(currentDate) + 1))
  const [filterYear, setFilterYear] = useState(String(getYear(currentDate)))
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')

  const years = useMemo(() => {
    const ys = new Set(transactions.map(t => String(getYear(new Date(t.date + 'T00:00:00')))))
    ys.add(String(getYear(currentDate)))
    return Array.from(ys).sort((a, b) => Number(b) - Number(a))
  }, [transactions])

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00')
      if (filterMonth !== '0' && getMonth(d) + 1 !== Number(filterMonth)) return false
      if (getYear(d) !== Number(filterYear)) return false
      if (filterCategory !== 'all' && t.category !== filterCategory) return false
      if (filterType !== 'all' && t.type !== filterType) return false
      if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
  }, [transactions, filterMonth, filterYear, filterCategory, filterType, searchQuery])

  const handleSuccess = useCallback(() => {
    router.refresh()
    // Optimistic: reload from server
    const supabase = createClient()
    supabase.from('transactions').select('*').order('date', { ascending: false }).then(({ data }) => {
      if (data) setTransactions(data)
    })
  }, [router])

  async function handleDelete() {
    if (!deletingId) return
    const supabase = createClient()
    await supabase.from('transactions').delete().eq('id', deletingId)
    setTransactions(prev => prev.filter(t => t.id !== deletingId))
    setDeletingId(null)
  }

  function exportCSV() {
    const headers = ['Data', 'Descrição', 'Tipo', 'Categoria', 'Valor']
    const rows = filtered.map(t => [
      format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy'),
      `"${t.description.replace(/"/g, '""')}"`,
      t.type === 'receita' ? 'Receita' : 'Despesa',
      t.category,
      t.amount.toFixed(2).replace('.', ','),
    ])

    const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transacoes-${filterYear}-${filterMonth.padStart(2, '0')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalReceitas = filtered.filter(t => t.type === 'receita').reduce((s, t) => s + t.amount, 0)
  const totalDespesas = filtered.filter(t => t.type === 'despesa').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Transações</h1>
          <p className="text-slate-500 text-sm mt-1">{filtered.length} transação(ões) encontrada(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
          <Button
            onClick={() => { setEditingTransaction(null); setFormOpen(true) }}
            className="bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Receitas</p>
          <p className="text-lg font-bold text-emerald-600 mt-1">{formatCurrency(totalReceitas)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <p className="text-xs text-slate-500 font-medium">Despesas</p>
          <p className="text-lg font-bold text-red-500 mt-1">{formatCurrency(totalDespesas)}</p>
        </div>
        <div className={`col-span-2 sm:col-span-1 rounded-xl p-4 shadow-sm ${totalReceitas - totalDespesas >= 0 ? 'bg-blue-600' : 'bg-orange-500'}`}>
          <p className="text-xs text-white/80 font-medium">Saldo</p>
          <p className="text-lg font-bold text-white mt-1">{formatCurrency(totalReceitas - totalDespesas)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Buscar por descrição..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterMonth} onValueChange={v => v && setFilterMonth(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => (
                <SelectItem key={i} value={String(i)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterYear} onValueChange={v => v && setFilterYear(v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={v => v && setFilterCategory(v)}>
            <SelectTrigger><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 mt-3">
          {(['all', 'receita', 'despesa'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === t
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'Todos' : t === 'receita' ? 'Receitas' : 'Despesas'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-600">Data</TableHead>
                <TableHead className="font-semibold text-slate-600">Descrição</TableHead>
                <TableHead className="font-semibold text-slate-600 hidden sm:table-cell">Categoria</TableHead>
                <TableHead className="font-semibold text-slate-600 hidden md:table-cell">Tipo</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Valor</TableHead>
                <TableHead className="font-semibold text-slate-600 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-400 py-12">
                    Nenhuma transação encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map(t => (
                  <TableRow key={t.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="text-slate-600 text-sm whitespace-nowrap">
                      {format(new Date(t.date + 'T00:00:00'), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-slate-800">{t.description}</span>
                      <span className="text-xs text-slate-400 sm:hidden block">{t.category}</span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="secondary"
                        style={{ backgroundColor: CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] + '20', color: CATEGORY_COLORS[t.category as keyof typeof CATEGORY_COLORS] }}
                        className="text-xs font-medium border-0"
                      >
                        {t.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={t.type === 'receita' ? 'default' : 'secondary'}
                        className={`text-xs ${t.type === 'receita' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : 'bg-red-100 text-red-600 hover:bg-red-100'}`}
                      >
                        {t.type === 'receita' ? 'Receita' : 'Despesa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`text-sm font-semibold ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {t.type === 'receita' ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingTransaction(t); setFormOpen(true) }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(t.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingTransaction(null) }}
        onSuccess={handleSuccess}
        editingTransaction={editingTransaction}
      />

      <AlertDialog open={!!deletingId} onOpenChange={open => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A transação será removida permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
