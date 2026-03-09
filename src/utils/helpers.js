export const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : '—'
export const formatDateTime = (iso) => iso ? new Date(iso).toLocaleString('en-US', { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) : '—'
export const formatFileSize = (bytes) => { if (!bytes) return '0 B'; if (bytes<1024) return bytes+' B'; if (bytes<1048576) return (bytes/1024).toFixed(1)+' KB'; return (bytes/1048576).toFixed(1)+' MB' }
export const getDeptColor = (id) => ({ SE:'#3B82F6', NC:'#F97316', IM:'#10B981' }[id] ?? '#64748B')
export const getStatusColors = (s) => ({ pending:{bg:'#FFFBEB',text:'#B45309',border:'#F59E0B'}, approved:{bg:'#ECFDF5',text:'#065F46',border:'#10B981'}, rejected:{bg:'#FEF2F2',text:'#991B1B',border:'#EF4444'} }[s] ?? {bg:'#F1F5F9',text:'#475569',border:'#CBD5E1'})

export function getEndTime(startTime, credits) {
  if (!startTime || !credits) return ''
  const [h, m] = startTime.split(':').map(Number)
  const endH = h + parseInt(credits, 10)
  return String(endH).padStart(2,'0') + ':' + String(m).padStart(2,'0')
}

export function calculateEndTime(startTime, credits) {
  return getEndTime(startTime, credits)
}

export function safeInt(value, fallback = 0) {
  const n = parseInt(value, 10)
  return isNaN(n) ? fallback : n
}
