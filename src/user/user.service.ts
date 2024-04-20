import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const saltRounds = 10;
    const hash = bcrypt.hashSync(createUserDto.password, saltRounds);
    const newUser = new this.userModel({
      ...createUserDto,
      password: hash,
    });

    return newUser.save();
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    if (!users) {
      throw new Error('No users found');
    }
    return users;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();
    return user;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updateUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
    if (!updateUser) {
      throw new NotFoundException('User not found');
    }
    return updateUser;
  }

//   remove(id: number) {
//     return `This action removes a #${id} user`;
//   }
// 
async remove(id: string): Promise<void> {
  const result = await this.userModel.deleteOne({ _id: id }).exec();
  if (result.deletedCount === 0) {
    throw new NotFoundException('User not found');
  }
}
}
