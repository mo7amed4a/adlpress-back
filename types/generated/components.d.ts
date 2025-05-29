import type { Schema, Struct } from '@strapi/strapi';

export interface HomeAlaqsamFyAlryysyt extends Struct.ComponentSchema {
  collectionName: 'components_home_alaqsam_fy_alryysyt';
  info: {
    description: '';
    displayName: '\u0627\u0644\u0627\u0642\u0633\u0627\u0645 \u0641\u064A \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629';
  };
  attributes: {
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Top Ranking'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'home.alaqsam-fy-alryysyt': HomeAlaqsamFyAlryysyt;
    }
  }
}
