/**
 * MIT License
 * Copyright (c) Alec Larson
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as React from 'react'
import { ReactElement, MutableRefObject } from 'react'

/** Ensure each type of `T` is an array */
export type Arrify<T> = [T, T] extends [infer T, infer DT]
  ? DT extends ReadonlyArray<any>
    ? Array<DT[number]> extends DT
      ? ReadonlyArray<T extends ReadonlyArray<infer U> ? U : T>
      : DT
    : ReadonlyArray<T extends ReadonlyArray<infer U> ? U : T>
  : never

/** Override the property types of `A` with `B` and merge any new properties */
export type Merge<A, B> = Remap<
  { [P in keyof A]: P extends keyof B ? B[P] : A[P] } & Omit<B, keyof A>
>

/** Return the keys of `T` with values that are assignable to `U` */
export type AssignableKeys<T, U> = T extends object
  ? U extends object
    ? {
        [P in Extract<keyof T, keyof U>]: T[P] extends U[P] ? P : never
      }[Extract<keyof T, keyof U>]
    : never
  : never

/** Better type errors for overloads with generic types */
export type Constrain<T, U> = [T] extends [Any] ? U : [T] extends [U] ? T : U

/** Try to simplify `&` out of an object type */
export type Remap<T> = object & {
  [P in keyof T]: T[P]
}

export type Overwrite<T, U> = Remap<Omit<T, keyof U> & U>

export type MergeUnknown<T, U> = Remap<T & Omit<U, keyof T>>

export type MergeDefaults<T extends object, U extends Partial<T>> = Remap<
  Omit<T, keyof U> & Partial<Pick<T, Extract<keyof U, keyof T>>>
>

export type OneOrMore<T> = T | readonly T[]

export type Falsy = false | null | undefined

// https://github.com/microsoft/TypeScript/issues/14829#issuecomment-504042546
export type NoInfer<T> = [T][T extends any ? 0 : never]

export type StaticProps<T> = Omit<T, keyof T & 'prototype'>

export interface Lookup<T = any> {
  [key: string]: T
}

export type LoosePick<T, K> = object & Pick<T, K & keyof T>

/** Intersected with other object types to allow for unknown properties */
export type UnknownProps = Lookup<unknown>

/** Use `[T] extends [Any]` to know if a type parameter is `any` */
export class Any {
  private _: never
}

export type AnyFn<In extends ReadonlyArray<any> = any[], Out = any> = (
  ...args: In
) => Out

/** Ensure the given type is an object type */
export type ObjectType<T> = T extends object ? T : {}

/** Intersect a union of objects but merge property types with _unions_ */
export type ObjectFromUnion<T extends object> = Remap<{
  [P in keyof Intersect<T>]: T extends infer U
    ? P extends keyof U
      ? U[P]
      : never
    : never
}>

/** Convert a union to an intersection */
type Intersect<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I
) => void
  ? I
  : never

export type AllKeys<T> = T extends any ? keyof T : never

export type Exclusive<T> = AllKeys<T> extends infer K
  ? T extends any
    ? Remap<
        LoosePick<T, K> & { [P in Exclude<K & keyof any, keyof T>]?: undefined }
      >
    : never
  : never
/** An object that needs to be manually disposed of */
export interface Disposable {
  dispose(): void
}

// react.d.ts
export type RefProp<T> = MutableRefObject<T | null | undefined>

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/34237
export type ElementType<P = any> =
  | React.ElementType<P>
  | LeafFunctionComponent<P>

// Function component without children
type LeafFunctionComponent<P> = {
  (props: P): ReactElement | null
  displayName?: string
}

export type ComponentPropsWithRef<T extends ElementType> =
  T extends React.ComponentClass<infer P>
    ? React.PropsWithoutRef<P> & React.RefAttributes<InstanceType<T>>
    : React.PropsWithRef<React.ComponentProps<T>>

// In @types/react, a "children" prop is required by the "FunctionComponent" type.
export type ComponentType<P = object> =
  | React.ComponentClass<P>
  | LeafFunctionComponent<P>
