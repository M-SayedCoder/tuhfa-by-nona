import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  SetMetadata,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard, IS_PUBLIC_KEY } from '../auth/jwt-auth.guard';
import { OrderStatus } from './order.schema';

const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // POST /api/orders
  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    body: {
      customerName?: string;
      phone?: string;
      occasionType?: string;
      mainColor?: string;
      customText?: string;
      details?: string;
      metroStation?: string;
    },
    @Request() req: any,
  ) {
    // ✅ FIX: تحقق مبكر من الحقول المطلوبة
    if (!body?.customerName?.trim() || !body?.phone?.trim()) {
      throw new BadRequestException('اسم العميل ورقم الهاتف مطلوبان');
    }

    // ✅ FIX: req.user قد يكون null في الطلبات العامة (Public)
    const user = req.user ?? null;
    const order = await this.ordersService.create(body as any, user);
    return { success: true, data: order.toJSON() };
  }

  // GET /api/orders
  @Get()
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    // ✅ FIX: التحقق من req.user قبل الوصول لـ isAdmin أو _id
    if (!req.user?._id) {
      throw new ForbiddenException('مطلوب تسجيل الدخول');
    }

    if (req.user.isAdmin) {
      const orders = await this.ordersService.findAll({ status, search });
      return { success: true, data: orders.map((o) => o.toJSON()) };
    } else {
      const orders = await this.ordersService.findByUser(
        req.user._id.toString(),
      );
      return { success: true, data: orders.map((o) => o.toJSON()) };
    }
  }

  // GET /api/orders/stats
  @Get('stats')
  async getStats(@Request() req: any) {
    if (!req.user?.isAdmin) {
      throw new ForbiddenException('غير مصرح، فقط الأدمن يمكنه رؤية الإحصائيات');
    }
    const stats = await this.ordersService.getStats();
    return { success: true, data: stats };
  }

  // GET /api/orders/:id
  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: any) {
    if (!id) throw new BadRequestException('معرّف الطلب مطلوب');

    const order = await this.ordersService.findById(id);

    if (
      !req.user?.isAdmin &&
      // ✅ FIX: optional chaining على order.userId
      order.userId?.toString() !== req.user?._id?.toString()
    ) {
      throw new ForbiddenException('غير مصرح لك بعرض هذا الطلب');
    }

    return { success: true, data: order.toJSON() };
  }

  // PATCH /api/orders/:id/status
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status?: OrderStatus; priceEGP?: number },
    @Request() req: any,
  ) {
    if (!req.user?.isAdmin) {
      throw new ForbiddenException('غير مصرح، فقط الأدمن يمكنه تغيير الحالة');
    }

    if (!body?.status) {
      throw new BadRequestException('حالة الطلب مطلوبة');
    }

    const order = await this.ordersService.updateStatus(
      id,
      body.status,
      body.priceEGP,
    );
    return { success: true, data: order.toJSON() };
  }

  // PUT /api/orders/:id
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      customerName: string;
      phone: string;
      metroStation: string;
      details: string;
      priceEGP: number;
      status: OrderStatus;
    }>,
    @Request() req: any,
  ) {
    if (!req.user?._id) {
      throw new ForbiddenException('مطلوب تسجيل الدخول');
    }

    const order = await this.ordersService.update(id, body, req.user);
    return { success: true, data: order.toJSON() };
  }

  // DELETE /api/orders/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string, @Request() req: any) {
    if (!req.user?._id) {
      throw new ForbiddenException('مطلوب تسجيل الدخول');
    }

    await this.ordersService.delete(id, req.user);
    return { success: true, message: 'تم حذف الطلب بنجاح' };
  }
}
