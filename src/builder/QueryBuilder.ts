import { Prisma } from "../../generated/prisma/client";

export class QueryBuilder<T> {
  public query: Prisma.Args<T, "findMany">;
  private queryParams: Record<string, unknown>;

  constructor(
    query: Prisma.Args<T, "findMany">,
    queryParams: Record<string, unknown>,
  ) {
    this.query = query;
    this.queryParams = queryParams;
  }

  search(searchableFields: string[]) {
    const searchTerm = this.queryParams.searchTerm as string;

    if (searchTerm) {
      this.query.where = {
        ...(this.query.where ?? {}),
        OR: searchableFields.map((field) => ({
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      };
    }

    return this;
  }

  filter() {
    const filters = { ...this.queryParams };

    delete filters.searchTerm;
    delete filters.page;
    delete filters.limit;
    delete filters.sortBy;
    delete filters.sortOrder;

    const where: Record<string, unknown> = {
      ...(this.query.where as object),
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        where[key] = value;
      }
    });

    this.query.where = where;

    return this;
  }

  sort() {
    const sortBy = (this.queryParams.sortBy as string) || "createdAt";
    const sortOrder = (this.queryParams.sortOrder as "asc" | "desc") || "desc";

    this.query.orderBy = {
      [sortBy]: sortOrder,
    };

    return this;
  }

  paginate() {
    const page = Number(this.queryParams.page) || 1;
    const limit = Number(this.queryParams.limit) || 10;

    this.query.skip = (page - 1) * limit;
    this.query.take = limit;

    return this;
  }
}
