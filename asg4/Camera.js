class Camera {
    constructor() {
        // Field of view of the camera in degrees.
        //this.fov = 60;
        // Position of the camera in the world space.
        /*
        this.eye = new Vector3([0, 0, 0]);
        // Point where the camera is looking.
        this.at = new Vector3([0, 0, 100]);x
        // The up vector of the camera, used to maintain orientation.
        this.up = new Vector3([0, 1, 0]);*/
        this.eye = new Vector3([13,3,-15]);
        this.at = new Vector3([10,0,100]);
        this.up = new Vector3([0,1,0]);
    }

    // Moves the camera forward along the view direction.
    forward() {
        var atCopy = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        // Calculate the forward direction vector.
        var f = atCopy.sub(eyeCopy).normalize();
        // Move both the camera position and the look-at point forward.
        this.eye = this.eye.add(f);
        this.at = this.at.add(f);
    }

    // Moves the camera backward along the view direction.
    backward() {
        var atCopy = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        // Calculate the backward direction by reversing the forward direction.
        var f = atCopy.sub(eyeCopy).normalize();
        // Move both the camera position and the look-at point backward.
        this.at = this.at.sub(f);
        this.eye = this.eye.sub(f);
    }

    // Moves the camera left relative to its current orientation.
    left() {
        var atCopy = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy).normalize().mul(-1);
        // Calculate the left direction using the right-hand rule.
        var s = Vector3.cross(f, this.up).normalize();
        // Adjust both the camera position and the look-at point to the left.
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    // Moves the camera right relative to its current orientation.
    right() {
        var atCopy = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy).normalize();
        // Calculate the right direction using the right-hand rule.
        var s = Vector3.cross(f, this.up).normalize();
        // Adjust both the camera position and the look-at point to the right.
        this.at = this.at.add(s);
        this.eye = this.eye.add(s);
    }

    // Rotates the camera to the right around the up axis.
    rotRight() {
        var atCopy = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy);
        // Create a rotation matrix for a small clockwise rotation.
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(-5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // Apply the rotation.
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }

    // Rotates the camera to the left around the up axis.
    rotLeft() {
        var atCopy = new Vector3(this.at.elements);
        var eyeCopy = new Vector3(this.eye.elements);
        var f = atCopy.sub(eyeCopy);
        // Create a rotation matrix for a small counter-clockwise rotation.
        var rotationMatrix = new Matrix4();
        rotationMatrix.setRotate(5, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        // Apply the rotation.
        var f_prime = rotationMatrix.multiplyVector3(f);
        this.at = f_prime.add(this.eye);
    }

    // Moves the camera vertically upward.
    upward() {
        // Increase the y-component of both the camera's position and look-at point.
        this.eye.elements[1] += 1;
        this.at.elements[1] += 1;
    }

    // Moves the camera vertically downward.
    downward() {
        // Decrease the y-component of both the camera's position and look-at point.
        this.eye.elements[1] -= 1;
        this.at.elements[1] -= 1;
    }
}
