import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './order.schema';
import { UserDocument } from '../users/user.schema';

function arabicDate(): string {
  return new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ✅ FIX: helper آمن للتحقق من ObjectId صالح قبل أي query
function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
  ) {}

  async create(
    data: {
      customerName: string;
      phone: string;
      occasionType: string;
      mainColor: string;
      customText: string;
      details?: string;
      metroStation?: string;
    },
    user: UserDocument | null,
  ): Promise<OrderDocument> {
    // ✅ FIX: تحقق من الحقول الإلزامية قبل الحفظ
    if (!data?.customerName?.trim()) {
      throw new BadRequestException('اسم العميل مطلوب');
    }
    if (!data?.phone?.trim()) {
      throw new BadRequestException('رقم الهاتف مطلوب');
    }

    try {
      const order = new this.orderModel({
        customerName: data.customerName.trim(),
        phone: data.phone.trim(),
        occasionType: data.occasionType?.trim() || '',
        mainColor: data.mainColor?.trim() || '',
        customText: data.customText?.trim() || '',
        details: data.details?.trim() || '',
        metroStation: data.metroStation?.trim() || '',
        // ✅ FIX: optional chaining على user قبل الوصول لأي property
        userId: user?._id ?? null,
        isVerifiedClient: user?.isVerifiedClient ?? false,
        createdAt: arabicDate(),
        createdAtRaw: new Date().toISOString(),
        status: 'pending',
      });

      return await order.save();
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      console.error('[OrdersService.create] Unexpected error:', err);
      throw new InternalServerErrorException('فشل حفظ الطلب، يرجى المحاولة لاحقاً');
    }
  }

  async findAll(filters?: {
    status?: string;
    month?: string;
    search?: string;
  }): Promise<OrderDocument[]> {
    try {
      const query: any = {};

      // ✅ FIX: التحقق من filters?.status قبل .includes()
      if (filters?.status && filters.status !== 'all') {
        query.status = filters.status;
      }

      if (filters?.search) {
        // ✅ FIX: trim آمن قبل إنشاء الـ regex
        const searchTerm = filters.search.trim();
        if (searchTerm) {
          const regex = new RegExp(searchTerm, 'i');
          query.$or = [
            { customerName: regex },
            { phone: regex },
            { customText: regex },
            { metroStation: regex },
          ];
        }
      }

      return await this.orderModel
        .find(query)
        .sort({ createdAtRaw: -1 })
        .exec();
    } catch (err: any) {
      console.error('[OrdersService.findAll] Unexpected error:', err);
      throw new InternalServerErrorException('فشل جلب قائمة الطلبات');
    }
  }

  async findByUser(userId: string): Promise<OrderDocument[]> {
    // ✅ FIX: التحقق من صلاحية الـ ObjectId قبل الاستعلام
    if (!userId || !isValidObjectId(userId)) {
      throw new BadRequestException('معرّف المستخدم غير صالح');
    }

    try {
      return await this.orderModel
        .find({ userId: new Types.ObjectId(userId) })
        .sort({ createdAtRaw: -1 })
        .exec();
    } catch (err: any) {
      console.error('[OrdersService.findByUser] Unexpected error:', err);
      throw new InternalServerErrorException('فشل جلب طلبات المستخدم');
    }
  }

  async findById(id: string): Promise<OrderDocument> {
    // ✅ FIX: التحقق من صلاحية الـ ObjectId قبل الاستعلام
    if (!id || !isValidObjectId(id)) {
      throw new BadRequestException('معرّف الطلب غير صالح');
    }

    try {
      const order = await this.orderModel.findById(id).exec();
      if (!order) throw new NotFoundException('الطلب غير موجود');
      return order;
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      if (err instanceof BadRequestException) throw err;
      console.error('[OrdersService.findById] Unexpected error:', err);
      throw new InternalServerErrorException('فشل جلب بيانات الطلب');
    }
  }

  async updateStatus(
    orderId: string,
    status: OrderStatus,
    priceEGP?: number,
  ): Promise<OrderDocument> {
    if (!orderId || !isValidObjectId(orderId)) {
      throw new BadRequestException('معرّف الطلب غير صالح');
    }

    if (!status) {
      throw new BadRequestException('حالة الطلب مطلوبة');
    }

    try {
      const updates: any = { status };
      // ✅ FIX: تحقق من priceEGP قبل إضافته
      if (priceEGP !== undefined && priceEGP !== null && !isNaN(priceEGP)) {
        updates.priceEGP = priceEGP;
      }

      const order = await this.orderModel
        .findByIdAndUpdate(orderId, updates, { new: true })
        .exec();

      if (!order) throw new NotFoundException('الطلب غير موجود');
      return order;
    } catch (err: any) {
      if (err instanceof NotFoundException) throw err;
      if (err instanceof BadRequestException) throw err;
      console.error('[OrdersService.updateStatus] Unexpected error:', err);
      throw new InternalServerErrorException('فشل تحديث حالة الطلب');
    }
  }

  async update(
    orderId: string,
    data: Partial<{
      customerName: string;
      phone: string;
      metroStation: string;
      details: string;
      priceEGP: number;
      status: OrderStatus;
    }>,
    requestingUser: UserDocument,
  ): Promise<OrderDocument> {
    if (!orderId || !isValidObjectId(orderId)) {
      throw new BadRequestException('معرّف الطلب غير صالح');
    }

    // ✅ FIX: التحقق من requestingUser قبل الوصول لأي property
    if (!requestingUser?._id) {
      throw new BadRequestException('بيانات المستخدم الطالب مفقودة');
    }

    try {
      const order = await this.findById(orderId);

      if (
        !requestingUser.isAdmin &&
        // ✅ FIX: optional chaining على order.userId قبل .toString()
        order.userId?.toString() !== requestingUser._id.toString()
      ) {
        throw new ForbiddenException('غير مصرح لك بتعديل هذا الطلب');
      }

      if (!requestingUser.isAdmin && data.status) {
        delete data.status;
      }

      const updated = await this.orderModel
        .findByIdAndUpdate(orderId, data, { new: true })
        .exec();

      if (!updated) throw new NotFoundException('الطلب غير موجود');
      return updated;
    } catch (err: any) {
      if (
        err instanceof ForbiddenException ||
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) throw err;

      console.error('[OrdersService.update] Unexpected error:', err);
      throw new InternalServerErrorException('فشل تعديل الطلب');
    }
  }

  async delete(orderId: string, requestingUser: UserDocument): Promise<void> {
    if (!orderId || !isValidObjectId(orderId)) {
      throw new BadRequestException('معرّف الطلب غير صالح');
    }

    if (!requestingUser?._id) {
      throw new BadRequestException('بيانات المستخدم الطالب مفقودة');
    }

    try {
      const order = await this.findById(orderId);

      if (
        !requestingUser.isAdmin &&
        // ✅ FIX: optional chaining على order.userId
        order.userId?.toString() !== requestingUser._id.toString()
      ) {
        throw new ForbiddenException('غير مصرح لك بحذف هذا الطلب');
      }

      if (!requestingUser.isAdmin && order.status !== 'pending') {
        throw new ForbiddenException('لا يمكن حذف الطلب بعد بدء التنفيذ');
      }

      await this.orderModel.findByIdAndDelete(orderId).exec();
    } catch (err: any) {
      if (
        err instanceof ForbiddenException ||
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) throw err;

      console.error('[OrdersService.delete] Unexpected error:', err);
      throw new InternalServerErrorException('فشل حذف الطلب');
    }
  }

  async getStats() {
    try {
      const [total, pending, confirmed, preparing, delivered, canceled] =
        await Promise.all([
          this.orderModel.countDocuments(),
          this.orderModel.countDocuments({ status: 'pending' }),
          this.orderModel.countDocuments({ status: 'confirmed' }),
          this.orderModel.countDocuments({ status: 'preparing' }),
          this.orderModel.countDocuments({ status: 'delivered' }),
          this.orderModel.countDocuments({ status: 'canceled' }),
        ]);

      const revenueResult = await this.orderModel.aggregate([
        { $match: { status: 'delivered', priceEGP: { $gt: 0 } } },
        { $group: { _id: null, total: { $sum: '$priceEGP' } } },
      ]);

      const pendingRevenueResult = await this.orderModel.aggregate([
        {
          $match: {
            status: { $in: ['confirmed', 'preparing'] },
            priceEGP: { $gt: 0 },
          },
        },
        { $group: { _id: null, total: { $sum: '$priceEGP' } } },
      ]);

      return {
        total,
        pending,
        confirmed,
        preparing,
        delivered,
        canceled,
        // ✅ FIX: optional chaining آمن على نتيجة aggregate
        revenue: revenueResult[0]?.total ?? 0,
        pendingRevenue: pendingRevenueResult[0]?.total ?? 0,
      };
    } catch (err: any) {
      console.error('[OrdersService.getStats] Unexpected error:', err);
      throw new InternalServerErrorException('فشل جلب الإحصائيات');
    }
  }
}
