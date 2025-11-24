export default class Employee {
  constructor({
    id,
    name,
    department,
    role,
    email,
    phone,
    city,
    country,
    age,
    image,
  }) {
    this.id = id;
    this.name = name;
    this.department = department || "General";
    this.role = role || "Staff";
    this.email = email || "";
    this.phone = phone || "";
    this.city = city || "";
    this.country = country || "";
    this.age = age || null;
    this.image = image || null;
  }

  static fromAPI(apiUser) {
    return new Employee({
      id: apiUser.id,
      name: `${apiUser.firstName} ${apiUser.lastName}`,
      department: apiUser.company?.department || "General",
      role: apiUser.company?.title || "Employee",
      email: apiUser.email,
      phone: apiUser.phone,
      city: apiUser.address?.city,
      country: apiUser.address?.country,
      age: apiUser.age,
      image: apiUser.image,
    });
  }

  get location() {
    if (this.city && this.country) return `${this.city}, ${this.country}`;
    return this.city || this.country || "";
  }

  toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      department: this.department,
      role: this.role,
      email: this.email,
      phone: this.phone,
      city: this.city,
      country: this.country,
      location: this.location,
      age: this.age,
    };
  }
}
