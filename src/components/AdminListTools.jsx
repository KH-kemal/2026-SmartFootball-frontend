import { Search } from 'lucide-react';
export default function AdminListTools({ value, onChange, count, total, placeholder }) {
  return <div className="admin-list-tools"><label><Search size={17} /><span className="sr-only">Cari data</span><input type="search" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} /></label><span>{count} dari {total} data</span></div>;
}
