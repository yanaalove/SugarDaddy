import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../lip/prisma';

async function findUser(user_id: string): Promise<{ user: any; table: string } | null> {
  try {
    const user = await prisma.user.findUnique({ where: { user_id } });
    if (user) return { user, table: "User" };

    return null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const result = await findUser(userId);
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { user } = result;
    return NextResponse.json({ completedTasks: user.completedTasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId, taskId } = await request.json();
  if (!userId || !taskId) {
    return NextResponse.json({ error: 'User ID and Task ID are required' }, { status: 400 });
  }

  try {
    const result = await findUser(userId);
    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { user } = result;
    const completedTasks = user.completedTasks ? user.completedTasks.split('-') : [];
    if (!completedTasks.includes(taskId)) {
      completedTasks.push(taskId);
    }

    const updatedUser = await prisma.user.update({
      where: { user_id: userId },
      data: { completedTasks: completedTasks.join('-') }
    });

    return NextResponse.json({ completedTasks: updatedUser.completedTasks });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

