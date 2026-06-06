'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CATEGORIES, TransactionFormData, Transaction } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface TransactionFormProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  editingTransaction?: Transaction | null
}

export default function TransactionForm({ open, onClose, onSuccess, editingTransaction }: TransactionFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState<TransactionFormData>({
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount || 0,
    date: editingTransaction?.date || new Date().toISOString().split('T')[0],
    type: editingTransaction?.type || 'despesa',
    category: editingTransaction?.category || 'Outros',
  })

  // Reset form when dialog opens/closes or editing transaction changes
  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setForm({
        description: editingTransaction?.description || '',
        amount: editingTransaction?.amount || 0,
        date: editingTransaction?.date || new Date().toISOString().split('T')[0],
        type: editingTransaction?.type || 'despesa',
        category: editingTransaction?.category || 'Outros',
      })
      setError('')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.description.trim()) {
      setError('Informe a descrição.')
      setLoading(false)
      return
    }
    if (!form.amount || form.amount <= 0) {
      setError('Informe um valor válido maior que zero.')
      setLoading(false)
      return
    }

    const supabase = createClient()

    if (editingTransaction) {
      const { error } = await supabase
        .from('transactions')
        .update(form)
        .eq('id', editingTransaction.id)

      if (error) {
        setError('Erro ao atualizar transação.')
        setLoading(false)
        return
      }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('transactions').insert({
        ...form,
        user_id: user!.id,
      })

      if (error) {
        setError('Erro ao criar transação.')
        setLoading(false)
        return
      }
    }

    setLoading(false)
    onSuccess()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); handleOpen(o) }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTransaction ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              {(['receita', 'despesa'] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    form.type === t
                      ? t === 'receita'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {t === 'receita' ? 'Receita' : 'Despesa'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                value={form.amount || ''}
                onChange={e => setForm(f => ({ ...f, amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as typeof f.category }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Salvando...' : editingTransaction ? 'Atualizar' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
