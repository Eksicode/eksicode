# eksicode Frontend Migration: Next.js → SvelteKit

## Proje Özeti

Mevcut Next.js frontend'ini SvelteKit'e migrate et. Backend (Node.js) değişmeyecek, sadece frontend yeniden yazılacak.

## Mevcut Yapı

- Framework: Next.js
- Konum: `./frontend` (veya mevcut klasör)
- Backend API: Aynı kalacak
- Auth: Mevcut auth sistemini koru

## Hedef Stack

- Framework: SvelteKit
- Styling: Tailwind CSS
- Dil: TypeScript
- Build: Adapter-node (Docker için)

## Migration Adımları

### 1. Analiz Aşaması

Önce mevcut projeyi analiz et:
- `pages/` veya `app/` dizinindeki tüm route'ları listele
- `components/` dizinindeki tüm component'ları listele
- API çağrılarının nasıl yapıldığını incele (fetch, axios, react-query vs.)
- Auth/session yönetimini incele
- Global state management varsa not al (Redux, Zustand, Context vs.)
- Environment variable'ları listele

### 2. SvelteKit Projesi Oluştur

```bash
npx sv create eksicode-svelte
# Seçenekler:
# - Template: Skeleton
# - TypeScript: Yes
# - Tailwind CSS: Yes
# - Prettier: Yes
# - ESLint: Yes
```

### 3. Temel Yapıyı Kur

```
src/
├── lib/
│   ├── components/     # Reusable components
│   ├── stores/         # Svelte stores (global state)
│   ├── api/            # API client utilities
│   └── utils/          # Helper functions
├── routes/
│   ├── +layout.svelte  # Root layout
│   ├── +page.svelte    # Homepage
│   └── [...routes]/    # Diğer sayfalar
└── app.html
```

### 4. Component Migration Kuralları

**React → Svelte dönüşüm pattern'leri:**

```jsx
// React
const [count, setCount] = useState(0);
useEffect(() => { ... }, [deps]);
{condition && <Component />}
{items.map(item => <Item key={item.id} />)}
```

```svelte
<!-- Svelte -->
let count = 0;
$: { ... }  // veya onMount(() => { ... })
{#if condition}<Component />{/if}
{#each items as item (item.id)}<Item />{/each}
```

**Props:**
```jsx
// React
function Button({ variant, children }) { }
```

```svelte
<!-- Svelte -->
<script>
  export let variant;
</script>
{@render children?.()}
```

### 5. API Çağrıları

Mevcut API client'ı SvelteKit'e uyarla:

```typescript
// src/lib/api/client.ts
const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });
  
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
```

### 6. Auth/Session Yönetimi

SvelteKit hooks ile auth yönetimi:

```typescript
// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');
  
  if (session) {
    event.locals.user = await validateSession(session);
  }
  
  return resolve(event);
};
```

### 7. Layout ve Shared State

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import '../app.css';
  import { page } from '$app/stores';
  
  let { children } = $props();
</script>

<nav>
  <!-- Navigation -->
</nav>

<main>
  {@render children()}
</main>
```

### 8. Docker Konfigürasyonu

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["node", "build"]
```

```javascript
// svelte.config.js
import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter({
      out: 'build',
    }),
  },
};
```

### 9. Environment Variables

```bash
# .env
VITE_API_URL=https://api.eksicode.org
```

## Önemli Notlar

1. **Her sayfayı migrate ettikten sonra test et** - API çağrıları çalışıyor mu, auth korunuyor mu?
2. **Tailwind class'larını koru** - Çoğu direkt çalışacak
3. **SEO meta tag'lerini unutma** - SvelteKit'te `<svelte:head>` kullan
4. **Loading state'leri ekle** - SvelteKit'te `+page.ts` ile load fonksiyonları
5. **Error handling** - `+error.svelte` sayfaları oluştur

## Öncelik Sırası

1. Layout ve navigation
2. Auth flow (login/register/logout)
3. Ana sayfa
4. Liste sayfaları
5. Detay sayfaları
6. Form'lar ve CRUD işlemleri
7. Profil ve ayarlar

## Test Kontrol Listesi

- [ ] Tüm sayfalar render oluyor
- [ ] API çağrıları çalışıyor
- [ ] Auth flow tam çalışıyor
- [ ] Mobile responsive
- [ ] SEO meta tag'leri doğru
- [ ] Build başarılı
- [ ] Docker container çalışıyor
- [ ] Memory kullanımı Next.js'ten düşük

---

Hazır olduğunda bu prompt'u Claude Code'a ver ve mevcut frontend klasörünü göster.
