"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from './ui/badge';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Order } from '@/lib/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type OrdersTableProps = {
  orders: Order[]
}

const formatter = new Intl.NumberFormat('pt-br', {
  style:"currency",
  currency:"BRL"
})

export default function OrdersTable({orders}:OrdersTableProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  function handleClick(field: string) {
    const params = new URLSearchParams(searchParams)

    const paramSortAlreadyExist = params.get("sort")

    if(paramSortAlreadyExist === field) {
      params.set("sort", `-${field}`)
    } else if(paramSortAlreadyExist === `-${field}`) {
      params.delete("sort")
    } else {
      params.set("sort", field)
    }

    replace(`${pathname}?${params.toString()}`)
  }

  function getSortIcon(field: string) {
    const sort = searchParams.get("sort")

    if(sort === field) {
      return <ChevronDown className="w-4" />
    }

    if(sort === `-${field}`) {
      return <ChevronUp className="w-4" />
    }

    return <ChevronsUpDown className="w-4" />
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="w-full">
          <TableHead className="table-cell">Cliente</TableHead>
          <TableHead className="table-cell">Status</TableHead>
          <TableHead className="table-cell cursor-pointer justify-end items-center gap-1">
            <div className="flex items-center gap-1" onClick={() => handleClick("order_date")}>
              Data
             {getSortIcon("order_date")}
            </div>
          </TableHead>
          <TableHead className="text-right cursor-pointer flex justify-end items-center gap-1" onClick={()=> handleClick("amount_in_cents")}>
            Valor
           {getSortIcon("amount_in_cents")}
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map(item => (
        <TableRow key={item.id}>
          <TableCell>
            <div className="font-medium">{item.customer_name}</div>
            <div className="hidden md:inline text-sm text-muted-foreground">
              {item.customer_email}
            </div>
          </TableCell>
          <TableCell>
            <Badge className={`text-xs`} variant="outline">
              {item.status === "pending"? "Pendente": "Completo"}
            </Badge>
          </TableCell>
          <TableCell className="hidden md:table-cell">
            {item.order_date.toString()}
          </TableCell>
          <TableCell className="text-right">
            {formatter.format(item.amount_in_cents/60)}
          </TableCell>
        </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
