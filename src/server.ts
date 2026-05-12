import { app } from './app.js';
import { env } from './shared/config/env.js';

app.listen(env.PORT, () => {
  console.log(`Whazzonline API running on port ${env.PORT}`);
});
