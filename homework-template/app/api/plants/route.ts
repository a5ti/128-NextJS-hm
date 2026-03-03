// Build on this, you can add your own as long as it fits the specs

import { NextRequest, NextResponse } from "next/server";
import { db } from '@/lib/db';
import { Plant } from '@/types';

export async function GET(request: NextRequest) {
    //the url contains several properties: accdg. to https://developer.mozilla.org/en-US/docs/Web/API/URL
    //since our objective is to only filter by location, we can create a new URL object, passing the request's url to convert it into an object
    //from this object, we can now extract the searchParams, which will contain the location query.
    // const url = new URL(request.url);
    // const urlParameters = url.searchParams;
    const { searchParams } = new URL(request.url); //destructure instead, extract only the searchParams from the url.
    const location = urlParameters.get('location'); //extracts the ?location= part of the url
    //after supposedly extracting the location query from the url, and upon checking the lib/db.ts file, I noticed several I guess built-in functions?
    //one of these was a findMany, and since our goal is to get all plants and optionally filter by location, I figured that this would be a perfect fit.
    //since the purpose of this GET handler is to fetch plants, return all plants if there is no location provided. if there is, filter by location
    const plants = await db.findMany(location ? { location } : undefined);  // used a ternary operator, if location exists, pass { location }, else pass undefined
    const message = location ? `Plants from ${location} retrieved successfully` : "All plants retrieved successfully"; //dynamic message yan boiii ternary ulit
    return NextResponse.json({ data: plants, message: message}, { status : 200}); //returns the appropriate status code, and a dynamic message depending on if it was filtered by location or not
        
}

export async function POST(request: NextRequest) {
}
