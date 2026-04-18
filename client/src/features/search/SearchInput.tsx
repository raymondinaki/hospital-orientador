import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isSearching?: boolean;
}

export function SearchInput({ value, onChange, isSearching }: SearchInputProps) {
  const { t } = useTranslation();

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('search.placeholder')}
        className="pl-10 pr-10 h-12 text-base"
        aria-label={t('search.placeholder')}
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 size-8"
          onClick={() => onChange('')}
          aria-label={t('common.close')}
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
}