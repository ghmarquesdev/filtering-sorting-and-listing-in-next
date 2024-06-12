"use client"

import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

type PaginationProps = {
  links: {
    url: string,
    label: string,
    active: boolean
  }[]
}

export default function Pagination({links}: PaginationProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const handleClickPage = useDebouncedCallback((pageNumber: number) => {
    const params = new URLSearchParams(searchParams)

    if(pageNumber === 1) {
      params.delete("page")
    }

    if(pageNumber > 1 && pageNumber <= 30) {
      params.set("page", pageNumber.toString())
    }

    if(pageNumber > 30) {
      params.set("page", "30")
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, 300)

  return (
    <PaginationComponent>
      <PaginationContent>
        <PaginationItem className={`${links[0].url ? "cursor-pointer": "cursor-no-drop text-slate-300 hover:text-slate-300" }`} onClick={() => handleClickPage(Number(searchParams.get("page")) - 1 || 1)}>
          <PaginationPrevious />
        </PaginationItem>

        {links.map((item, i) => {
          if(item.label.includes("Anterior") || item.label.includes("Próximo")) {
            return null
          }

          if(item.label === "...") {
            return (
              <PaginationItem 
                key={i} 
                className='hidden md:inline-flex' 
              >
                <PaginationEllipsis />
              </PaginationItem>
            )
          }

          return (
            <PaginationItem 
              key={i} 
              className='cursor-pointer' 
              onClick={() => handleClickPage(Number(item.label))}
            >
              <PaginationLink
                 isActive={item.active} 
                 dangerouslySetInnerHTML={{ __html: item.label }}
              ></PaginationLink>
            </PaginationItem>
          )
        })}

        <PaginationItem onClick={() => handleClickPage(Number(searchParams.get("page")) + 1)}>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}
