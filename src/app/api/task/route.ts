import { NextResponse } from 'next/server';
import prisma from '../../../lip/prisma';

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: { completedTasks: true }
    });

    if (!user) {
      const secondaryUser = await prisma.secondaryUser.findUnique({
        where: { user_id: userId },
        select: { completedTasks: true }
      });

      if (!secondaryUser) {
        const tertiaryUser = await prisma.tertiaryUser.findUnique({
          where: { user_id: userId },
          select: { completedTasks: true }
        });

        if (!tertiaryUser) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ completedTasks: tertiaryUser.completedTasks });
      }

      return NextResponse.json({ completedTasks: secondaryUser.completedTasks });
    }

    return NextResponse.json({ completedTasks: user.completedTasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId, taskId } = await request.json();
  if (!userId || !taskId) {
    return NextResponse.json({ error: 'User ID and Task ID are required' }, { status: 400 });
  }

  try {
    const updateUser = async (model) => {
      const user = await model.findUnique({
        where: { user_id: userId },
        select: { completedTasks: true }
      });

      if (!user) return null;

      const completedTasks = user.completedTasks ? user.completedTasks.split('-') : [];
      if (!completedTasks.includes(taskId)) {
        completedTasks.push(taskId);
      }

      return await model.update({
        where: { user_id: userId },
        data: { completedTasks: completedTasks.join('-') }
      });
    };

    let updatedUser = await updateUser(prisma.user);
    if (!updatedUser) updatedUser = await updateUser(prisma.secondaryUser);
    if (!updatedUser) updatedUser = await updateUser(prisma.tertiaryUser);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ completedTasks: updatedUser.completedTasks });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

