import { NextResponse } from "next/server";

// Mock users data
const users = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "user" },
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      data: users,
      success: true,
      status: 200,
      message: "Users retrieved successfully",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        success: false,
        status: 500,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic validation
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          error: "Name and email are required",
          success: false,
          status: 400,
        },
        { status: 400 }
      );
    }

    const newUser = {
      id: users.length + 1,
      name: body.name,
      email: body.email,
      role: body.role || "user",
    };

    users.push(newUser);

    return NextResponse.json({
      data: newUser,
      success: true,
      status: 201,
      message: "User created successfully",
    });
  } catch {
    return NextResponse.json(
      {
        error: "Failed to create user",
        success: false,
        status: 500,
      },
      { status: 500 }
    );
  }
}
