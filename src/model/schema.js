// model/schema.js
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const blogSchema = appSchema({
  version: 4,
  tables: [
    tableSchema({
      name: "orderList",
      columns: [
        { name: "orderNumber", type: "string" },
        { name: "clientId", type: "string" },
        { name: "status", type: "string" },
        { name: "loanType", type: "string" },
        { name: "orderDate", type: "string" },
        { name: "dueDate", type: "string" },
        { name: "street1", type: "string" },
        { name: "city", type: "string" },
        { name: "state", type: "string" },
        { name: "postalCode", type: "string" },
        { name: "modifiedDate", type: 'string' },
        { name: "hash", type: 'string' },
      

      ]
    }),
    
    
  ],
});
