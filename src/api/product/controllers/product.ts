/**
 * product controller
 */

import { factories } from '@strapi/strapi';
import { Context } from 'koa';

export default factories.createCoreController('api::product.product', ({ strapi }) => ({
  async findOne(ctx: Context) {
    // Custom logic: Add locale to query
    ctx.query = { ...ctx.query, locale: 'en' };

    // جلب البرودكت المحدد بـ documentId
    const { id } = ctx.params;

    
    const specificProductResults = await strapi.entityService.findMany('api::product.product', {
      filters: {        
        // @ts-ignore
        documentId: id,
      },
      populate: ctx.query.populate || '*',
      locale: ctx.query.locale || 'en', // احترام الـ locale من الـ query
    });

    // التأكد من وجود البرودكت
    if (!specificProductResults || specificProductResults.length === 0) {
      return ctx.notFound('Product not found');
    }

    const specificProduct = specificProductResults[0];

    // جلب باقي البرودكتس باستثناء البرودكت المحدد
    const filters = ctx.query.filters && typeof ctx.query.filters === 'object' ? ctx.query.filters : {};
    const otherProducts = await strapi.entityService.findMany('api::product.product', {
      filters: {
        ...filters,
      },
      sort: { createdAt: 'asc' },
      populate: ctx.query.populate || '*',
      locale: ctx.query.locale || 'en',
    });

    // خلط البرودكتس عشوائيًا واختيار 5
    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
    const randomProducts = shuffled.slice(0, 5);

    // دمج البرودكت المحدد مع البرودكتس العشوائية
    // const finalProducts = [specificProduct, ...randomProducts];

    // تنظيف الداتا
    const sanitizedResults = await this.sanitizeOutput(randomProducts, ctx);

    // إعداد الـ meta
    const meta = {
      pagination: {
        page: 1,
        pageSize: 6,
        pageCount: 1,
        total: randomProducts.length,
      },
      date: Date.now(), // إضافة التاريخ زي المثال
    };

    // إرجاع الـ response بنفس النمط
    return { data: specificProduct, products: sanitizedResults, meta };
  },
}));