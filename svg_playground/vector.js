/* 
  2D vector related constructors and methods.
*/

function Point(x_coordinate, y_coordinate)
/* 
  A constructor that creates a point object, which represents some point in the xy-plane.
*/
{
  this.x = x_coordinate;
  this.y = y_coordinate;
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

function Vector(x_component, y_component)
/* 
  A constructor that creates a generic 2D vector object, which could be a position vector, a velocity, an acceleration 
  vector, etc.
*/
{
  this.xc = x_component; // "xc" stands for the x-component of the generic vector.
  this.yc = y_component; // "yc" stands for the y-component of the generic vector.
}
    
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Vector.prototype.add = function(that)
/* 
  Adds the two vectors and returns the vector result.
*/
{
  var gv = new Vector(0, 0); // "gv" stands for "generic vector".
  
  gv.xc = this.xc + that.xc;
  gv.yc = this.yc + that.yc;
  
  return gv;    
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Vector.prototype.diff = function(that)
/* 
  Subtracts the two vectors (i.e., this - that) and returns the vector result.
*/
{
  var gv = new Vector(0, 0); // "gv" stands for "generic vector".
  
  gv.xc = this.xc - that.xc;
  gv.yc = this.yc - that.yc;
  
  return gv;    
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Vector.prototype.multi = function(s)
/* 
  Multiplies the scale "s" with the vector and returns the vector result.
*/
{
  var gv = new Vector(0, 0); // "gv" stands for "generic vector".
  
  gv.xc = s * this.xc;
  gv.yc = s * this.yc;
  
  return gv;        
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Vector.prototype.dot = function(that)
/* 
  Returns the dot product of the vectors and returns the scalar result.
*/
{
  return (this.xc * that.xc) + (this.yc * that.yc);
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

Vector.prototype.magnitude = function()
/* 
  Returns the magnitude of the vector.
*/
{
  return Math.sqrt(this.xc*this.xc + this.yc*this.yc);
}

