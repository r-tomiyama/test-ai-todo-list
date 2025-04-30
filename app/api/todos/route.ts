import { NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

// GET: Fetch all todos
export async function GET() {
  const todos = await prisma.todo.findMany();
  return NextResponse.json(todos);
}

// POST: Create a new todo
export async function POST(request: Request) {
  const { title } = await request.json();
  const newTodo = await prisma.todo.create({
    data: { title },
  });
  return NextResponse.json(newTodo);
}

// PUT: Update a todo
export async function PUT(request: Request) {
  const { id, completed } = await request.json();
  const updatedTodo = await prisma.todo.update({
    where: { id },
    data: { completed },
  });
  return NextResponse.json(updatedTodo);
}

// DELETE: Delete a todo
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.todo.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Todo deleted' });
}