---
title: useDataProvider
source: packages/core/src/hooks/data/useDataProvider.tsx
---

`useDataProvider` is a React hook that returns the `dataProvider` which is passed to [`<Refine>`][refine] component.

It is useful when you have multiple data providers and you want to access one of them.

## Usage

Let's say we have two data providers:

```tsx
import { Refine } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";

const App = () => {
  return (
    <Refine
      dataProvider={{
        default: dataProvider("API_URL"),
        second: dataProvider("SECOND_API_URL"),
      }}
    >
      {/* ... */}
    </Refine>
  );
};

export default App;
```

Now we can access the data providers with the `useDataProvider` hook:

```tsx
import { useDataProvider } from "@refinedev/core";

const dataProvider = useDataProvider();

const defaultDataProvider = dataProvider(); // return default data provider
const secondDataProvider = dataProvider("second"); // return second data provider
```

## API

### Properties

| Property         | Description                                      | Type     | Default   |
| ---------------- | ------------------------------------------------ | -------- | --------- |
| dataProviderName | The name of the data provider you want to access | `string` | `default` |

### Return value

| Description   | Type                                                  |
| ------------- | ----------------------------------------------------- |
| Data Provider | [`Data Provider`](/docs/core/providers/data-provider) |

[refine]: /docs/core/refine-component
[data provider]: /docs/core/providers/data-provider
