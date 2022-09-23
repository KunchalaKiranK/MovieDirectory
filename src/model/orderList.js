import { Model } from '@nozbe/watermelondb';
import { field, relation, children, action } from '@nozbe/watermelondb/decorators';

export class Post extends Model {
  static table = 'orderList';

  static associations = {
    orderList: { type: 'belongs_to', key: 'blog_id' },
   
  };

  @field('orderNumber')
  orderNumber;

  @field('clientId')
  clientId;

  @field('status')
  status;

  @field('loanType')
  loanType;
  
  @field('orderDate')
  orderDate;

  @field('dueDate')
  dueDate;
  
  @field('street1')
  street1;

  @field('city')
  city;

  @field('state')
  state;

  @field('postalCode')
  postalCode;

  @field('modifiedDate')
  modifiedDate;

  @field('hash')
  hash;



  

