// fragments microservice API to use, defaults to localhost:8080 if not set in env
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export async function ConvertFragments(user, id, ext) {
  console.log('Requesting user fragments data...');
  try {
    const fragmentRes = await fetch(`${apiUrl}/v1/fragments/${id}${ext}`, {
      headers: user.authorizationHeaders(),
    });

    if (!fragmentRes.ok) {
      throw new Error(`${fragmentRes.status} ${fragmentRes.statusText}`);
    }

    const contentType = fragmentRes.headers.get('Content-Type');
    let fragmentData;
    if (contentType && contentType.includes('image')) {
      fragmentData = await fragmentRes.blob();
    } else if (contentType && contentType.includes('application/json')) {
      fragmentData = await fragmentRes.json();
    } else {
      fragmentData = await fragmentRes.text();
    }
    return fragmentData;
  } catch (err) {
    console.error('Unable to call GET /v1/fragment', { err });
  }
}
