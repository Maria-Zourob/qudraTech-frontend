import {ImageResponse} from 'next/og';

export const size = {width: 32, height: 32};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          background: 'transparent'
        }}
      >
        <div
          style={{
            width: 7,
            height: 18,
            background: '#19324A',
            marginInlineEnd: 2
          }}
        />

        <div
          style={{
            width: 7,
            height: 26,
            background: '#19324A',
            marginInlineEnd: 2
          }}
        />

        <div
          style={{
            width: 7,
            height: 32,
            background: '#789B87'
          }}
        />
      </div>
    ),
    {...size}
  );
}
