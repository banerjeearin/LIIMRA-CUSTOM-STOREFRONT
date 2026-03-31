# Analytics Tacking - Test Scenarios & Variants

## Category 1: Campaign Entry & Identity (UTM Parsing)
| Variant | Scenario | Expected Behavior |
| :--- | :--- | :--- |
| **1.1** | Direct Entry (No UTMs) | `anonymous_id` generates. `PageView` contains `null` UTMs. |
| **1.2** | Meta Ads CPC Entry | `?utm_source=facebook&utm_medium=cpc&utm_campaign=spring_launch`. Payload captures UTM mapping perfectly. |
| **1.3** | Google Ads Search | `?utm_source=google&utm_medium=cpc&utm_term=buy_ragi`. Term and Source stored. |

## Category 2: Engagement Milestones
| Variant | Scenario | Expected Behavior |
| :--- | :--- | :--- |
| **2.1** | View Product Drawer | Map to `ViewContent` (Meta) & `view_item` (GA4). `content_ids` required. |
| **2.2** | Partial Scroll (30%) | `ScrollDepth25` event fires once. |
| **2.3** | Full Scroll (100%) | `ScrollDepth25`, `50`, `75`, and `100` fire sequentially, no duplicates. |
| **2.4** | Search Execution | `Search` event with payload `search_string` mapping. |

## Category 3: E-Commerce Funnel
| Variant | Scenario | Expected Behavior |
| :--- | :--- | :--- |
| **3.1** | Add initial item | `AddToCart` fires with standard value, currency, and IDs. |
| **3.2** | Increment Quantity | Subsequent `AddToCart` fires representing the added delta value. |
| **3.3** | Remove Cart Item | `RemoveFromCart` custom event triggers with lost pipeline revenue value. |
| **3.4** | Checkout Initiated | `InitiateCheckout` fires aggregating the complete array of products. |

## Category 4: Conversion & Identity Bonding
| Variant | Scenario | Expected Behavior |
| :--- | :--- | :--- |
| **4.1** | Valid Purchase | Simulated backend webhook fires `Purchase`. Valid string matching for `order_id` and previous `anonymous_id`. |
| **4.2** | User Sign in | `CustomerLogin` bridges session to canonical `customer_id`. |
| **4.3** | User Registration | `CompleteRegistration` seed sets bridging origin. |
