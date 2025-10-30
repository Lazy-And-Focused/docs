---
sidebarTitle: entities
---

# Каталог сущностей

Содержимым папки являются описание бизнес-сущностей, или сущностей, которые приносят бизнесу пользу. Например, ими может быть User, Post или даже что-то более экзотичное.

Пример:

```ts
// entities/post/schema.ts
import * as z from "zod";
import { UserSchema } from '@entities/user';
 
export const PostSchema = z.object({ 
  id: z.string(),

  title: z.string(),
  description: z.string(),

  author: UserSchema,
});
```

```ts
// entities/post/model.ts
import * as z from "zod"; 
import { PostSchema } from './schema';

type Post = z.infer<typeof PostSchema>;
```

```ts
// entities/post/index.ts
export type { Post } from './model';

export { PostSchema } from './schema';
```