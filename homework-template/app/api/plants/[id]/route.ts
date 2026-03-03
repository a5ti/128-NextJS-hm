import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
//USE OF AI:
//I had to ask what a Promise was, since my previous code was throwing a "params is a Promise" error, and after learning what it was,
//modified my code so that params is now wrapped in an await.params
//after that, it worked as intended.
interface paramID {
  params: Promise<{ id: string }>;
}
//for getting the plant with a unique id
export async function GET(request: NextRequest, { params }: paramID) {
  const { id } = await params;
  const plant = await db.findUnique(id); //this function was also in /lib/db.ts
  if (!plant) {
    return NextResponse.json(
      { error: `Plant with ID ${id} does not exist` },
      { status: 404 },
    ); //not found
  }
  return NextResponse.json({
    data: plant,
    message: `Plant with ID ${id} found successfully`,
  }); //found
}
//for updating the plants info
export async function PATCH(request: NextRequest, { params }: paramID) {
  try {
    const { id } = await params;
    const body = await request.json(); //extract body from request
    const updatedPlant = await db.update(id, body); //update entry with given id, with given body
    if (!updatedPlant) {
      return NextResponse.json(
        { error: `Plant with ID ${id} not found` },
        { status: 404 },
      ); //not found
    }
    return NextResponse.json(
      //as per specs, return updated plant, and proper status code
      {
        data: updatedPlant,
        message: `Plant with ID ${id} updated successfully`,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 }); //bad request
  }
}
//the function for deleting plants given id
export async function DELETE(request: NextRequest, { params }: paramID) {
  const { id } = await params;
  const deleteStatus = await db.delete(id); //uses db.delete, which returns a boolean

  if (!deleteStatus) {
    return NextResponse.json(
      { error: `Plant with ID ${id} not found` },
      { status: 404 },
    ); //not found
  }
  return NextResponse.json({
    message: `Plant with ID ${id} deleted successfully`,
  }); //found
}
