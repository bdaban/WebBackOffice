export type PeriodKey = 'day' | 'week' | 'month' | 'quarter' | 'halfyear' | 'year' | 'last7d' | 'last30d' | 'last90d' | 'last180d' | 'last365d' | 'ytd'

function startOfDay(d: Date) {
	const x = new Date(d)
	x.setHours(0, 0, 0, 0)
	return x
}

function endOfDay(d: Date) {
	const x = new Date(d)
	x.setHours(23, 59, 59, 999)
	return x
}

function parseDateOnly(input: string) {
	// Supported: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY, DD-MM-YYYY
	const t = String(input).trim()
	let y: number | null = null
	let m: number | null = null
	let d: number | null = null
	if (/^\d{4}-\d{2}-\d{2}$/.test(t)) {
		const [yy, mm, dd] = t.split('-').map(Number)
		y = yy; m = mm; d = dd
	} else if (/^\d{2}[./-]\d{2}[./-]\d{4}$/.test(t)) {
		const sep = t.includes('.') ? '.' : (t.includes('/') ? '/' : '-')
		const [dd, mm, yy] = t.split(sep).map(Number)
		y = yy; m = mm; d = dd
	}
	if (!y || !m || !d) return null
	// Create LOCAL date (not UTC), we normalize with startOfDay/endOfDay
	return new Date(y, m - 1, d)
}

export function getRangeFromQuery(query: Record<string, any>, fallbackDays = 30) {
	const period = String(query.period || '') as PeriodKey
	const fromStr = query.from ? String(query.from) : ''
	const toStr = query.to ? String(query.to) : ''

	let from: Date | null = null
	let to: Date | null = null

	if (fromStr && toStr) {
		const pf = parseDateOnly(fromStr)
		const pt = parseDateOnly(toStr)
		from = pf ? startOfDay(pf) : null
		to = pt ? endOfDay(pt) : null
	}

	if (!from || !to) {
		const now = new Date()
		const todayStart = startOfDay(now)
		const todayEnd = endOfDay(now)
		switch (period) {
			case 'day':
				from = todayStart; to = todayEnd; break
			case 'week': {
				const d = new Date(todayStart)
				d.setDate(d.getDate() - 6)
				from = d; to = todayEnd; break
			}
			case 'month': {
				const d = new Date(todayStart)
				d.setMonth(d.getMonth() - 1)
				from = d; to = todayEnd; break
			}
			case 'quarter': {
				const d = new Date(todayStart)
				d.setMonth(d.getMonth() - 3)
				from = d; to = todayEnd; break
			}
			case 'halfyear': {
				const d = new Date(todayStart)
				d.setMonth(d.getMonth() - 6)
				from = d; to = todayEnd; break
			}
			case 'year': {
				const d = new Date(todayStart)
				d.setFullYear(d.getFullYear() - 1)
				from = d; to = todayEnd; break
			}
			case 'last7d': {
				const d = new Date(todayStart)
				d.setDate(d.getDate() - 6)
				from = d; to = todayEnd; break
			}
			case 'last30d': {
				const d = new Date(todayStart)
				d.setDate(d.getDate() - 29)
				from = d; to = todayEnd; break
			}
			case 'last90d': {
				const d = new Date(todayStart)
				d.setDate(d.getDate() - 89)
				from = d; to = todayEnd; break
			}
			case 'last180d': {
				const d = new Date(todayStart)
				d.setDate(d.getDate() - 179)
				from = d; to = todayEnd; break
			}
			case 'last365d': {
				const d = new Date(todayStart)
				d.setDate(d.getDate() - 364)
				from = d; to = todayEnd; break
			}
			case 'ytd': {
				const y = now.getFullYear()
				from = new Date(y, 0, 1)
				to = todayEnd; break
			}
			default: {
				const d = new Date(todayStart)
				d.setDate(d.getDate() - (fallbackDays - 1))
				from = d; to = todayEnd; break
			}
		}
	}

	if (!from || !to) {
		const now = new Date()
		from = startOfDay(new Date(now.getTime() - fallbackDays * 86400000))
		to = endOfDay(now)
	}

	// swap if inverted
	if (from > to) {
		const tmp = from
		from = to
		to = tmp
	}

	return { from, to }
}

export function diffDays(from: Date, to: Date) {
	return Math.max(1, Math.ceil((to.getTime() - from.getTime()) / 86400000))
}


